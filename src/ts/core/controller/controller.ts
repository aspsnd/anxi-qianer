import { Atom } from "../chain/atom";
import { AnxiEventer } from "../e2/eventer";

/**
 * 控制器的抽象
 */
export class Controller<T extends Atom = Atom> extends AnxiEventer {
  belonger: T
  constructor(atom: T) {
    super();
    this.belonger = atom;
    this.init();
  }
  init() {

  }
  refresh() {

  }
  onTime() {

  }
}