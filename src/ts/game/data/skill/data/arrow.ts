import { Sprite, Texture } from "pixi.js";
import { Flyer } from "../../../../core/chain/flyer";
import { SkillProto } from "../../../../core/controller/skill/proto";
import { Arrow } from "../../../arrow";

export const arrowAttack = new SkillProto('attack', {
  description: '连续的射击'
}).execute(function () {
  const timer = this.timer as Arrow;
  new Flyer(new Sprite(Texture.from('./res/image/0.png')), (flyer) => {
    flyer.bind(timer.world);
    timer.world.flyerContainer.addChild(flyer.sprite);
    flyer.sprite.scale.set(2, 2)
    flyer.x = timer.x;
    flyer.y = timer.y;
  }).useSpeed((time: number) => 5 + time * .2).useDirection(-90);

});