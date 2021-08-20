import { Sprite, Texture } from "pixi.js";
import { Timer } from "../core/chain/timer";
import { EnemyProto } from "./data/enemy/indedx";
import { GameWorld } from "./world";
export class Enemy extends Timer {



  view!: Sprite

  group = 1

  constructor(public proto: EnemyProto) {
    super();
    this.init();
  }

  init() {
    this.view = new Sprite(Texture.from(this.proto.view!));

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

  world!: GameWorld
  bind(world: GameWorld) {
    super.bind(world);
    this.world = world;
  }

}