import { Timer } from "../../chain/timer";
import type { AnxiPlainListener } from "../../e2/eventer";
import { AnxiEventer } from "../../e2/eventer";
import type { SkillProto } from "./proto";

export class Skill<D extends Partial<{ [key: string]: any }> = {}, T extends {} = {}> extends AnxiEventer {

  name: string
  data!: D
  active: boolean
  cancel: SkillProto<T, D>['canceler']
  execute: SkillProto<T, D>['executer']
  extra: SkillProto<T, D>['extra']
  _initFunc: SkillProto<T, D>['_init']
  waitTime: SkillProto<T, D>['waitTime']
  waitUntil = -1
  inited = false
  listeners: AnxiPlainListener<string>[] = []
  removed = false

  constructor(public proto: SkillProto<T, D>) {
    super();
    this.active = proto._active;
    this.name = proto.name;
    this.cancel = proto.cancel;
    this.execute = proto.executer;
    this.extra = proto.extra;
    this._initFunc = proto._init;
    this.waitTime = proto.waitTime;
  }
  init() {
    this.inited = true;
    this.data = this.proto.datar.call(this);
    this.proto.initedListens.forEach(il => {
      let ecomt = this.timer.on(il.event, il.handler(this.timer, this), true);
      this.listeners.push(ecomt);
    });
    this._initFunc.call(this, this.data);
  }
  remove() {
    this.removed = true;
    for (const listener of this.listeners) {
      this.timer.removeListener(listener);
    }
  }

  timer!: Timer
  link<K extends Timer>(atom: K) {
    this.timer = atom;
  }

}