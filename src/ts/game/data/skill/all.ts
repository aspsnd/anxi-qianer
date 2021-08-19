import type { SkillProto } from "../../../core/controller/skill/proto";

const modules = import.meta.globEager('./data/*');

const SkillProtos: Record<string, SkillProto> = {};

for (const m of Object.values(modules)) {
  for (const [_, proto] of Object.entries(m) as [string, SkillProto][]) {
    SkillProtos[proto.name] = proto;
  }
}

export { SkillProtos };