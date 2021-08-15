import { Graphics, Loader, Text } from "pixi.js";
import { Page } from "../base/page";
import { GameHeight, GameWidth } from "../global/config";
import { GlobalEventer } from "../global/emiter";

export class LoadPage extends Page {
  processBar = new Graphics()
  constructor(loader: Loader) {
    super();
    this.processBar.beginFill(0x3355ee, 1).drawRect(0, 0, GameWidth, 16);
    this.processBar.y = GameHeight * .8;
    this.addChild(this.processBar);
    this.processBar.scale.set(0, 1);
    loader.load();
    loader.onProgress.add(() => {
      this.processBar.x = (loader.progress * .01 - 1) * GameWidth;
      this.processBar.scale.set(loader.progress * .01, 1);
    })
    const animationTime = 10;
    loader.onComplete.add(() => {
      let text = new Text('逃 离 签 狱', {
        stroke: 0x23eedd,
        strokeThickness: 5,
        fontSize: 210,
        fontFamily: 'cursive',
        dropShadow: true,
        dropShadowColor: 0xff8811,
        dropShadowAlpha: .35,
        dropShadowBlur: 12,
        dropShadowDistance: 10
      });
      text.anchor.set(.5, .5);
      text.position.set(GameWidth >> 1, 220);
      text.alpha = 0;
      this.addChild(text);
      GlobalEventer.doUntil(animationTime, time => {
        text.alpha = time / animationTime;
        this.processBar.alpha -= 1 / (animationTime >> 1);
      });
      GlobalEventer.waitFor(animationTime, () => {
        GlobalEventer.emit('resourceloaded');
      })
    })
  }
}