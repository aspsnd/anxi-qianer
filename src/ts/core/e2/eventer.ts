import { AnxiEvent } from './event';
import { AnxiPlainListener, AsyncAnxiListener, AnxiPlainHandler, AsyncAnxiHandler, AnxiListener } from './eventer.d';
/**
 * - 支持异步事件
 * - 支持事件拦截
 * - map储存handler，提高搜索效率
 * - 先执行同步，再执行异步, 不再支持linked类型listener
 * - 新增上下文模式，开启后绑定事件与触发事件时的上下文一致才会执行handler
 * - EventName不能是AnxiEvent类型或其子类型
 */
export class AnxiEventer<EventName = string> {
  static DEBUG_WARN = true
  debug_warn = AnxiEventer.DEBUG_WARN
  _counter = 0
  _listeners = new Map<EventName, AnxiPlainListener<EventName>[]>()
  _asyncListeners = new Map<EventName, AsyncAnxiListener<EventName>[]>()
  _useContextMode = false;
  getContext?: () => any
  on(nameOrEvent: EventName | AnxiEvent<EventName>, handler?: AnxiPlainHandler<EventName>, always = false) {
    if (handler) {
      return this.addEventListener(nameOrEvent as EventName, handler, always);
    } else {
      const event = nameOrEvent instanceof AnxiEvent ? nameOrEvent : new AnxiEvent(nameOrEvent);
      this.emit(event);
    }
  }
  async async(nameOrEvent: EventName | AnxiEvent<EventName>, handler?: AsyncAnxiHandler<EventName>, always = false) {
    if (handler) {
      return this.addAsyncListener(nameOrEvent as EventName, handler, always);
    } else {
      const event = nameOrEvent instanceof AnxiEvent ? nameOrEvent : new AnxiEvent(nameOrEvent);
      return await this.emit(event);
    }
  }
  async emit(e: AnxiEvent<EventName>) {
    this._emitingDepth++;
    if (this._listeners.has(e.name)) {
      let listeners = this._listeners.get(e.name)!;
      for (const listener of listeners) {
        if (e.intercepted) return;
        if (!listener.valid) continue;
        listener.valid = !listener.handler(e);
      }
    }
    if (this._asyncListeners.has(e.name)) {
      let listeners = this._asyncListeners.get(e.name)!;
      for (const listener of listeners) {
        if (e.intercepted) return;
        if (!listener.valid) continue;
        listener.valid = !(await listener.handler(e));
      }
    }
    this._emitingDepth--;
    /**
     * 在达到一定次数可清理时机时进行清理
     */
    if (this._emitingDepth == 0) {
      this._clearClick--;
      if (this._clearClick == 0) {
        this.releaseRubbish();
      }
    }
  }
  once(name: EventName, handler: AnxiPlainHandler<EventName>, always = false) {
    return this.addEventListener(name, e => handler(e) || true, always);
  }
  onceAsync(name: EventName, handler: AsyncAnxiHandler<EventName>, always = false) {
    return this.addAsyncListener(name, async e => await (handler(e) || true), always);
  }
  addEventListener(name: EventName, handler: AnxiPlainHandler<EventName>, always = false) {
    let listener: AnxiPlainListener<EventName> = {
      index: this._counter++,
      handler,
      always,
      valid: true,
      async: false,
      name
    }
    this._bindContext(listener);
    let listeners: AnxiPlainListener<EventName>[];
    if (this._listeners.has(name)) {
      listeners = this._listeners.get(name)!;
    } else {
      listeners = [];
      this._listeners.set(name, listeners);
    };
    listeners.push(listener);
    return listener;
  }
  addAsyncListener(name: EventName, handler: AsyncAnxiHandler<EventName>, always = false) {
    let listener: AsyncAnxiListener<EventName> = {
      index: this._counter++,
      handler,
      always,
      valid: true,
      async: true,
      name
    }
    this._bindContext(listener);
    let listeners: AsyncAnxiListener<EventName>[];
    if (this._asyncListeners.has(name)) {
      listeners = this._asyncListeners.get(name)!;
    } else {
      listeners = [];
      this._asyncListeners.set(name, listeners);
    };
    listeners.push(listener);
    return listener;
  }
  _bindContext(listener: AnxiPlainListener<EventName> | AsyncAnxiListener<EventName>) {
    if (!this._useContextMode) return;
    listener.context = this.getContext?.();
  }
  _emitingDepth: number = 0
  _clearWait: number = 20
  _clearClick: number = this._clearWait
  releaseRubbish() {
    this._clearClick = this._clearWait;
    for (const key of this._listeners.keys()) {
      this._listeners.set(key, this._listeners.get(key)!.filter(l => l.valid));
    }
    for (const key of this._asyncListeners.keys()) {
      this._asyncListeners.set(key, this._asyncListeners.get(key)!.filter(l => l.valid));
    }
  }
  removeListeners() {
    if (this._emitingDepth > 0) this.warn('some event is emitting!');
    for (const key of this._listeners.keys()) {
      this._listeners.set(key, this._listeners.get(key)!.filter(l => l.valid && l.always));
    }
    for (const key of this._asyncListeners.keys()) {
      this._asyncListeners.set(key, this._asyncListeners.get(key)!.filter(l => l.valid && l.always));
    }
  }
  removeListenersAbsolute() {
    if (this._emitingDepth > 0) this.warn('some event is emitting!');
    this._listeners.clear();
    this._asyncListeners.clear();
  }
  removeListener(listener: AnxiListener<EventName>) {
    let listeners: Map<EventName, AnxiListener<EventName>[]> = listener.async ? this._asyncListeners : this._listeners;
    listeners.set(listener.name, listeners.get(listener.name)!.filter(l => l.index !== listener.index));
  }
  removeListenerByName(name: EventName) {
    this._listeners.delete(name);
    this._asyncListeners.delete(name);
  }
  warn(...msg: any[]) {
    if (!this.debug_warn) return;
    console.warn(...msg);
  }
}