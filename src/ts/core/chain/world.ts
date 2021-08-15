import { AnxiEvent } from "../e2/event";
import { Timer } from "./timer";

export class World extends Timer {
  time = 0
  frame = 0
  constructor() {
    super();
  }
  onFrame() {
    this.frame++;
    this.emit(new AnxiEvent('onframe', this.frame));
    this.emit(new AnxiEvent(`frame_${this.frame}`, this.frame));
  }
}