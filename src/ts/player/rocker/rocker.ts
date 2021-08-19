import { Circle, Container, DisplayObject, Graphics } from "pixi.js";


export type RockerOption = {
  radius?: number
  limit?: number
  flowing?: false | {
    include(x: number, y: number): boolean,
    autoFade?: boolean
  }
  outer?: DisplayObject
  inner?: DisplayObject
}

export const defaultRockerOption: RockerOption = {
  radius: 140,
  limit: 140,
  flowing: false,
}

export class Rocker extends Container {
  option: RockerOption
  outer: DisplayObject
  inner: DisplayObject
  active = true
  constructor(option?: RockerOption) {
    super();
    this.option = Object.assign({}, defaultRockerOption, option);
    if (this.option.flowing) {
      this.option.flowing.autoFade = this.option.flowing.autoFade ?? true;
    }
    this.outer = this.option.outer ?? this.autoCreateCircle(this.option.radius!);
    this.addChild(this.outer);
    this.inner = this.option.inner ?? this.autoCreateCircle(this.option.radius! * .3);
    this.addChild(this.inner);
    this.hitArea = new Circle(0, 0, this.option.radius);
    this.interactive = true;
    this.once('added', () => {
      this.option.flowing ? this.initFlowingEvents() : this.initEvents();
    })
    this.on('change', e => {
      this.target = e;
    })
  }
  autoCreateCircle(radius: number): Graphics {
    let graphics = new Graphics();
    graphics.lineStyle(5, 0xaaaaaa, .85).drawCircle(0, 0, radius);
    return graphics;
  }
  target: [number, number] = [0, 0]
  initEvents() {
    this.on('touchstart', e => {
      this.emit('move', e);
    })
    this.on('touchmove', e => {
      this.emit('move', e);
    });
    this.on('move', e => {
      let center = this.getGlobalPosition();
      let now = e.data.global;
      let moved = [(now.x - center.x) / this.option.limit!, (now.y - center.y) / this.option.limit!];
      let moved2 = moved[0] ** 2 + moved[1] ** 2;
      if (moved2 > 1) {
        let moved2square = moved2 ** .5;
        moved[0] /= moved2square;
        moved[1] /= moved2square;
      };
      this.inner.position.set(this.option.limit! * moved[0], this.option.limit! * moved[1]);
      this.emit('change', moved);
    });
    const endHandler = () => {
      this.inner.position.set(0, 0);
      this.emit('change', [0, 0]);
    }
    this.on('touchend', endHandler);
    this.on('touchendoutside', endHandler);
  }
  initFlowingEvents() {
    const config = this.option.flowing as {
      include(x: number, y: number): boolean,
      autoFade?: boolean
    }
    config.autoFade && (this.visible = false);
    let start = [0, 0];
    this.parent.on('touchstart', e => {
      let pos = e.data.global;
      if (!config.include(pos.x, pos.y)) return;
      start = [pos.x, pos.y];
      config.autoFade && (this.visible = true);
      this.position.set(...start);
    });
    this.parent.on('touchmove', e => {
      let center = this.getGlobalPosition();
      let now = e.data.global;
      let moved = [(now.x - center.x) / this.option.limit!, (now.y - center.y) / this.option.limit!];
      let moved2 = moved[0] ** 2 + moved[1] ** 2;
      if (moved2 > 1) {
        let moved2square = moved2 ** .5;
        moved[0] /= moved2square;
        moved[1] /= moved2square;
      };
      this.inner.position.set(this.option.limit! * moved[0], this.option.limit! * moved[1]);
      this.emit('change', moved);
    });
    const endHandler = () => {
      this.inner.position.set(0, 0);
      config.autoFade && (this.visible = false);
      this.emit('change', [0, 0]);
    }
    this.parent.on('touchend', endHandler);
    this.parent.on('touchendoutside', endHandler);
  }
}
