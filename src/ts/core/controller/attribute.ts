import { Attribute } from "../attribute";
import { Atom } from "../chain/atom";
import { Controller } from "./controller";

export class AttributeController<A extends string = string> extends Controller {
  attrs: { [key in A]?: Attribute<A> } = {}
  attrArray: Attribute<A>[] = []
  needCompute = false
  relyChain: { [key in A]?: Attribute<A>[] } = {}
  constructor(atom: Atom, block: Record<A, number>) {
    super(atom);
    this.from(block);
    this.compute();
  }
  from(block: Record<A, number>) {
    for (const [p, v] of Object.entries(block) as [A, number][]) {
      const attr = this.attrs[p] = new Attribute(p, this);
      this.attrArray.push(attr);
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
    let needComputeAttr = new Set(this.attrArray);
    while (needComputeAttr.size > 0) {
      let nextNeedComputeAttr = new Set<Attribute<A>>();
      for (const attr of needComputeAttr) {
        const changed = attr.caculate();
        if (changed) {
          for (const a of this.relyChain[attr.name] ?? []) {
            nextNeedComputeAttr.add(a);
          }
        }
      }
      needComputeAttr = nextNeedComputeAttr;
    }

    for (const attr of this.attrArray) {
      attr.caculateAnnoy();
    }

    this.needCompute = false;

  }
  computeAbsolutely() {
    for (const attr of this.attrArray) {
      attr.caculate();
    }
    this.needCompute = false;
  }
}