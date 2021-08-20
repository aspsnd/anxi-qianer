import { AnxiEvent } from "../e2/event";
import { Atom } from "./atom";

export class Timer extends Atom {
  timespeed = 1
  time = 0
  _destroyed = false;
  onTimer() {

  }
  onTime() {
    this.time++;
    this.emit(new AnxiEvent('time', this.time));
    this.emit(new AnxiEvent(`time_${this.time}`, this.time));
    this.onTimer();
    return this._destroyed;
  }

  waitFor(time: number, func: (e: AnxiEvent) => void) {
    return this.once(`time_${this.time + time}`, func);
  }
  doUntil(until: number, func: (time: number) => void) {
    const begin = this.time;
    this.on('time', _ => {
      if (this.time - begin > until) {
        return true;
      } else {
        func(this.time - begin);
      }
    });
  }

  parent?: Timer
  bind(parent: Timer) {
    this.parent = parent;
    parent.on('time', this.onTime.bind(this));
  }
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    this.on(new AnxiEvent('destroy'));
  }
}