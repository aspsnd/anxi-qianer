import { Texture, TilingSprite } from "pixi.js";
import { Page } from "../base/page";
import { GlobalEventer } from "../global/emiter";
import { getAppSize } from "../global/resizer";

export class GamePage extends Page {
  bg = new TilingSprite(Texture.from('./res/image/bg.webp'));
  constructor() {
    super();
    this.once('added', _ => {
      this.init();
    })
  }
  speed = 5
  init() {
    this.parent.parent.addChild(this.bg);
    let size = getAppSize();
    this.bg.width = size[0];
    this.bg.height = size[1] << 1;
    GlobalEventer.on('appresize', ([w, h]: number[]) => {
      size = [w, h];
      console.log(w, h)
      this.bg.width = size[0];
      this.bg.height = size[1] << 1;
    })
    GlobalEventer.on('onframe', () => {
      this.bg.y += this.speed;
      if (this.bg.y > 0) this.bg.y -= this.bg.texture.height;
    })
  }
}