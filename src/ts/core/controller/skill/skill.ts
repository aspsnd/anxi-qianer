import { Atom } from "../../chain/atom";
import { AnxiEventer } from "../../e2/eventer";
import { SkillProto } from "./proto";

export class Skill<D extends {} = {}, T extends {} = {}> extends AnxiEventer {

  name: string
  data?: D
  active: boolean
  cancel: SkillProto<T, D>['canceler']
  execute: SkillProto<T, D>['executer']
  extra: SkillProto<T, D>['extra']
  _initFunc: SkillProto<T, D>['_init']
  waitTime: SkillProto<T, D>['waitTime']
  waitUntil = -1
  inited = false

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

  }
  remove(){
    
  }

  atom!: Atom
  link<K extends Atom>(atom: K) {
    this.atom = atom;
  }

}