import { Application, Container } from "pixi.js"
import { GameHeight, GameWidth } from "./global/config";
import { GlobalEventer } from "./global/emiter";
import { getAppSize } from "./global/resizer";
import { loadAllResource } from "./loader";
import { GamePage } from "./page/game";
import { LoadPage } from "./page/load";
import { RockerPanel } from "./player/rocker/panel";
import { Rocker } from "./player/rocker/rocker";

export const init = async () => {
  const [width, height] = getAppSize();
  const app = new Application({
    view: canvas,
    width,
    height,
    antialias: true,
  });

  GlobalEventer.link(app);
  GlobalEventer.on('appresize', ([width, height]: [number, number]) => {
    app.view.width = width;
    app.view.height = height;
    center.position.set((width - GameWidth) >> 1, (height - GameHeight) >> 1);
    app.resize();
  })
  app.start();
  loadAllResource(app.loader);

  const center = new Container();
  center.position.set((width - GameWidth) >> 1, (height - GameHeight) >> 1);
  app.stage.addChild(center);
  center.addChild(new LoadPage(app.loader));

  GlobalEventer.on('resourceloaded', () => {
    center.removeChildren();
    let panel = new RockerPanel();
    let rocker = new Rocker({
      flowing: {
        include(_x, y) {
          return y > getAppSize()[1] * .3;
        },
        autoFade: true
      }
    });
    panel.addChild(rocker);
    rocker.position.set(280, GameHeight * .6);
    app.stage.addChild(panel);

    app.stage.sortableChildren = true;
    panel.zIndex = 1000;


    let gamePanel = new GamePage();
    center.addChild(gamePanel);

  })

}