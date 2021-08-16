import { Attribute } from "../attribute";
import { Atom } from "../chain/atom";
import { Controller } from "./controller";

export class AttributeController<A extends string = string> extends Controller {
  attrs: { [key in A]?: Attribute } = {}
  attrArray: Attribute[] = []
  needCompute = false
  relyChain: { [key in A]?: Set<Attribute> } = {}
  constructor(atom: Atom, block: Record<A, number>) {
    super(atom);
    this.from(block);
    this.compute();
  }
  from(block: Record<A, number>) {
    for (const [p, v] of Object.entries(block) as [A, number][]) {
      const attr = this.attrs[p] = new Attribute(p, this);
      attr.addCommonCaculator(() => {
        attr.base += v;
      });
    }
  }
  get(attr: A) {
    return this.attrs[attr]?.value ?? 0;
  }
  getAttr(attr: A) {
    return this.attrs[attr]!;
  }
  init() {
    super.init();
  }
  compute() {
    for(const attr of this.attrArray){
      attr.caculate();
    }
    this.needCompute = false;
  }
  computeAbsolutely() {
    for(const attr of this.attrArray){
      attr.caculate();
    }
    this.needCompute = false;
  }
}