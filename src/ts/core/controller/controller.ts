import { Atom } from "../chain/atom";
import { AnxiEventer } from "../e2/eventer";

/**
 * 控制器的抽象
 */
export class Controller<T extends Atom = Atom> extends AnxiEventer {
  belonger: T
  name: string
  constructor(atom: T) {
    super();
    this.name = new.target.name;
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