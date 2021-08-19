import { Application, Container } from "pixi.js"
import { GameHeight, GameWidth } from "./global/config";
import { GlobalEventer } from "./global/emiter";
import { getAppSize } from "./global/resizer";
import { loadAllResource } from "./loader";
import { GamePage } from "./page/game";
import { LoadPage } from "./page/load";

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

  app.stage.sortableChildren = true;
  const center = new Container();
  center.zIndex = 100;
  center.position.set((width - GameWidth) >> 1, (height - GameHeight) >> 1);
  app.stage.addChild(center);
  center.addChild(new LoadPage(app.loader));

  GlobalEventer.on('resourceloaded', () => {
    center.removeChildren();

    let gamePanel = new GamePage();
    center.addChild(gamePanel);

    GlobalEventer.on('onframe', _ => {
      gamePanel.world.onTime();
    })

  })

}