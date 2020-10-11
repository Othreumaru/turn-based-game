import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import { AppContext, StageSwitcher, store } from './app';
import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import { TweenManager } from '@zalgoforge/the-tween';
import { Provider } from 'react-redux';
import { Stage } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';

const tweenManager: TweenManager = new TweenManager();

const size = { width: 1920, height: 1080 };
const ratio = size.width / size.height;

const createApp = (canvas: HTMLCanvasElement) => {
  PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON;
  const app = new PIXI.Application({
    backgroundColor: 0x10bb99,
    height: size.height,
    width: size.width,
    view: canvas,
  });

  app.ticker.add(() => {
    tweenManager.update();
  });

  const resize = () => {
    let h;
    let w;
    if (window.innerWidth / window.innerHeight >= ratio) {
      w = window.innerHeight * ratio;
      h = window.innerHeight;
    } else {
      w = window.innerWidth;
      h = window.innerWidth / ratio;
    }
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = h + 'px';
  };
  resize();
  window.onresize = resize;

  return app;
};

const CanvasComponent = hot(({ MainComponent }: any) => {
  const [app, setApp] = useState<PIXI.Application>();

  return (
    <canvas
      ref={(canvasRef) => {
        if (!app && canvasRef) {
          setApp(createApp(canvasRef));
        }
      }}
    >
      {app ? (
        <Stage app={app}>
          <Provider store={store}>
            <AppContext.Provider
              value={{ app, tweenManager, width: size.width, height: size.height }}
            >
              <MainComponent />
            </AppContext.Provider>
          </Provider>
        </Stage>
      ) : (
        'Initializing...'
      )}
    </canvas>
  );
});

const renderApp = (Main: React.FC<any>) => {
  ReactDOM.render(
    <CanvasComponent MainComponent={Main} store={store} />,
    document.getElementById('root')
  );
};

renderApp(StageSwitcher);

if (module.hot) {
  module.hot.accept('./app', () => {
    renderApp(require('./app').StageSwitcher);
  });
}
