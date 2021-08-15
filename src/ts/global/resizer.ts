import { GameHeight, GameWidth } from "./config";
import { GlobalEventer } from "./emiter";

export const GameScale = GameWidth / GameHeight;
window.onresize = () => {
  GlobalEventer.emit('appresize', getAppSize());
}
export function getAppSize(): [number, number] {
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let appWidth: number, appHeight: number;
  let curScale = width / height;
  if (curScale > GameScale) {
    appHeight = GameHeight;
    appWidth = Math.round(curScale * appHeight);
  } else {
    appWidth = GameWidth;
    appHeight = Math.round(appWidth / curScale);
  };
  return [appWidth, appHeight];
}

export function bindToObj<P1 extends string, P2 extends string>(obj: Record<P1 | P2, number>, widthProperty: P1, heightProperty: P2, func: (width: number, height: number) => void = () => { }) {
  const [width, height] = getAppSize();
  obj[widthProperty] = width;
  obj[heightProperty] = height;
  func(width, height);
  GlobalEventer.on('appresize', ([width, height]: [number, number]) => {
    obj[widthProperty] = width;
    obj[heightProperty] = height;
    func(width, height);
  })
}