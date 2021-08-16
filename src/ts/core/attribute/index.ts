import type { AttributeController } from "../controller/attribute"
import { AnxiEvent } from "../e2/event"

export interface AttributeCaculator {
  (controller: AttributeController, attr: Attribute): void
}

export class Attribute {

  //计算出的基础属性值
  base = 0
  //计算出的额外属性值
  extra = 0
  //计算出的属性倍率
  baseRate = 1
  extraRate = 1

  //最终基础属性值
  finalBase = 0
  //最终额外属性值
  finalExtra = 0
  //最终属性值
  value = 0

  // 建议以此更改base，extra
  commonCaculators: AttributeCaculator[] = []
  // 建议以此更改baseRate，extraRate
  rateCaculators: AttributeCaculator[] = []
  /**
   * 直接更改finalBase、finalExtra
   * 实现避免属性的循环依赖，如技能:【增加血量5%的攻击力，增加攻击力200%的血量】
   * 该计算发生在最后，任意的计算结果都不会抛出属性值改变的事件
   */
  annoyCaculators: AttributeCaculator[] = []
  constructor(public name: string, public controller: AttributeController) { }
  //对属性值进行计算
  caculate() {
    const oldValue = this.value;
    
    this.base = this.extra = this.finalBase = this.finalExtra = this.value = 0;
    this.baseRate = this.extraRate = 1;

    for (const caculator of this.commonCaculators) {
      caculator(this.controller, this);
    }
    for (const caculator of this.rateCaculators) {
      caculator(this.controller, this);
    }

    this.finalBase = this.base * this.baseRate;
    this.finalExtra = this.extra * this.extraRate;
    this.value = this.finalBase + this.finalExtra;

    if (this.value !== oldValue) {
      this.controller.emit(new AnxiEvent(`${this.name}change`, [oldValue, this.value]));
    }

    for (const caculator of this.annoyCaculators) {
      caculator(this.controller, this);
    }

    this.value = this.finalBase + this.finalExtra;

  }
  rely(attr: string) {
    if (!this.controller.relyChain[attr]) {
      this.controller.relyChain[attr] = new Set();
    }
    this.controller.relyChain[attr]!.add(this);
  }
  addCommonCaculator(func: AttributeCaculator) {
    this.commonCaculators.push(func);
  }
  addRateCaculator(func: AttributeCaculator) {
    this.rateCaculators.push(func);
  }
  addAnnoyCaculator(func: AttributeCaculator) {
    this.annoyCaculators.push(func);
  }
}