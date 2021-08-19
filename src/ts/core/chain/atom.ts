import { Controller } from "../controller/controller";
import { AnxiEventer } from "../e2/eventer";

export class Atom extends AnxiEventer {
  controllers: { [key: string]: Controller } = {}
  get<T extends Controller>(constructor: new (...args: any[]) => T): T {
    return this.controllers[constructor.name] as T;
  }
  add<T extends Controller>(controller: T): T {
    return this.controllers[controller.name] = controller;
  }
  constructor() {
    super();
  }
}