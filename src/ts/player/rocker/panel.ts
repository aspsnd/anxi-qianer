import { Container, Rectangle } from "pixi.js";
import { GameHeight, GameWidth } from "../../global/config";
import { bindToObj } from "../../global/resizer";

export class RockerPanel extends Container {
  constructor() {
    super();
    this.hitArea = new Rectangle(0, 0, GameWidth, GameHeight);
    bindToObj(this.hitArea as Rectangle, 'width', 'height');
    this.interactive = true;
  }
}