import { AnxiEvent } from "../../e2/event";
import { AttributeController } from "../attribute";
import { Controller } from "../controller";
import { Skill } from "./skill";

export class SkillController extends Controller {
  skills: Skill[] = []

  add(skill: Skill) {
    this.skills.push(skill);
    skill.link(this.belonger);
    skill.init();
    for (const [k, { rely }] of Object.entries(skill.proto.initedAttrs)) {
      this.belonger.get(AttributeController).getAttr(k).rely(...rely);
    }
    this.belonger.on(new AnxiEvent('addskill', skill));
  }
  remove(skill: Skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
    skill.remove();
    for (const [k, { rely }] of Object.entries(skill.proto.initedAttrs)) {
      this.belonger.get(AttributeController).getAttr(k).removeRely(...rely);
    }
    this.belonger.on(new AnxiEvent('removeskill', skill));
  }

  compute() {

  }

}