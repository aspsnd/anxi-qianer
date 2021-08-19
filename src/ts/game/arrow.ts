import { Sprite, Texture } from "pixi.js";
import { Timer } from "../core/chain/timer";
import { AttributeController } from "../core/controller/attribute";
import { SkillController } from "../core/controller/skill";
import { Skill } from "../core/controller/skill/skill";
import { AnxiEvent } from "../core/e2/event";
import { GameHeight, GameWidth } from "../global/config";
import { SkillProtos } from "./data/skill/all";
import { ArrowProtoGetter } from "./proto";

export class Arrow extends Timer {
  view = new Sprite(Texture.from('./res/image/arrow/0.png'))
  proto = ArrowProtoGetter()
  constructor() {
    super();
    this.view.scale.set(3, 3);
    this.view.anchor.set(.5, .5);
    this.x = GameWidth >> 1;
    this.y = GameHeight - 100;

    this.add(new AttributeController(this, this.proto));
    const skillController = this.add(new SkillController(this));
    skillController.add(new Skill(SkillProtos['attack']));

    // @ts-ignore
    window.arrow = this;

  }
  onTime() {
    const result = super.onTime();
    if (this.time % 60 === 0) {
      this.emit(new AnxiEvent('wantskill', 'attack'));
    }
    return result;
  }
  set x(x: number) {
    this.view.x = x;
  }
  set y(y: number) {
    this.view.y = y;
  }
  get x() {
    return this.view.x;
  }
  get y() {
    return this.view.y;
  }
}