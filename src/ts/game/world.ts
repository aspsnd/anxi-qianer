import { Container, Sprite, Texture } from "pixi.js";
import { Atom } from "../core/chain/atom";
import { Flyer } from "../core/chain/flyer";
import { World } from "../core/chain/world";
import { AttributeController } from "../core/controller/attribute";
import { GameHeight, GameWidth } from "../global/config";
import { getAppSize } from "../global/resizer";
import { RockerPanel } from "../player/rocker/panel";
import { Rocker } from "../player/rocker/rocker";
import { Arrow } from "./arrow";

export class GameWorld extends World {
  atoms: Atom[] = []
  flyerContainer = new Container();
  constructor(public container: Container) {
    super();
    this.container.addChild(this.flyerContainer);
    const arrow = new Arrow();
    arrow.bind(this);
    this.atoms.push(arrow);
    this.container.addChild(arrow.view);


    let panel = new RockerPanel();
    let rocker = new Rocker({
      flowing: {
        include(_x, y) {
          return y > getAppSize()[1] * .3;
        },
        autoFade: true
      }
    });
    panel.addChild(rocker);
    rocker.position.set(280, GameHeight * .6);
    this.container.parent.parent.addChild(panel);
    panel.zIndex = 1000;
    const speedAttr = arrow.get(AttributeController).getAttr('speed');
    this.on('time', _ => {
      arrow.x += speedAttr.value * rocker.target[0];
      arrow.y += speedAttr.value * rocker.target[1];
      if (this.time % 50 === 0) {
        // let enemy = new Enemy(EnemyProto0);
        // enemy.bind(this);
        // this.atoms.push(enemy);
        // this.container.addChild(enemy.view);
        new Flyer(new Sprite(Texture.from('./res/image/qian.png')), flyer => {
          this.flyerContainer.addChild(flyer.sprite);
          flyer.x = GameWidth * Math.random();
          flyer.bind(this);
        }).useSpeed(time => time * .15 + 5).useDirection(90);
      }
    });



  }
}