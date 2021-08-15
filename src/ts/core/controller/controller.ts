import { Atom } from "../chain/atom";

/**
 * 控制器的抽象
 */
export class Controller<T extends Atom = Atom> {
  belonger: T
  constructor(atom: T) {
    this.belonger = atom;
  }
  init() {

  }
  refresh() {

  }
  onTime() {

  }
}