import { Loader } from "@pixi/loaders";

export const loadAllResource = (loader: Loader) => {
  let res = import.meta.globEager('../../../res/**');
  loader.add(Object.values(res).map(r => r.default));
}