import EventEmitter from "eventemitter3";
import { Application } from "pixi.js";

export class GlobalTimer extends EventEmitter {
  frame = 0
  constructor() {
    super();
  }
  onFrame() {
    this.frame++;
    this.emit('onframe', this.frame);
    this.emit(`frame_${this.frame}`, this.frame);
  }

  waitFor(time: number, func: (frame: number) => void) {
    return this.once(`frame_${this.frame + time}`, func);
  }
  doUntil(until: number, func: (time: number) => void) {
    const begin = this.frame;
    const handler = (frame: number) => {
      if (frame - begin > until) {
        this.removeListener('onframe', handler);
      } else {
        func(frame - begin);
      }
    }
    this.on('onframe', handler);
  }

  link(app: Application) {
    app.ticker.add(this.onFrame.bind(this));
  }

}
export const GlobalEventer = new GlobalTimer();