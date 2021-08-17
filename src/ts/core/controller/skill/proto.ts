import { AttributeCaculator } from "../../attribute";
import { Skill } from "./skill";

export class SkillProto<T extends {}, D extends {} = {}>{

  constructor(public name: string, public extra: T) { }

  _init: ((this: Skill<D>, data: D) => void) = () => { }

  init(_init: (this: Skill<D>, data: D) => void) {
    this._init = _init;
    return this;
  }

  executer: ((this: Skill<D>, ...args: any[]) => void) = () => { }
  execute(executer: (this: Skill<D>, ...args: any[]) => void) {
    this.executer = executer;
    return this;
  }

  canceler: ((this: Skill<D>, ...args: any[]) => void) = () => { }
  cancel(canceler: (this: Skill<D>, ...args: any[]) => void) {
    this.canceler = canceler;
    return this;
  }

  _active = false
  active(bool: boolean = true) {
    this._active = bool;
    return this;
  }


  initedAttrs: {
    [attr: string]: {
      rely: string[],
      caculator: AttributeCaculator
    }
  } = {}
  initAttr(prop: string, rely: string[], caculator: AttributeCaculator) {
    this.initedAttrs[prop] = {
      rely,
      caculator
    };
    return this;
  }

  exeHelper: ((this: Skill) => boolean) = () => true
  canExecute(helper:((this: Skill) => boolean)) {
    this.exeHelper = helper;
    return this;
  }

  waitTime = 0
  wait(time: number) {
    this.waitTime = time;
    return this;
  }

}