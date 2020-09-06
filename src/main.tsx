import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MainStage } from './components/main-stage';
import { useState } from 'react';
import * as PIXI from 'pixi.js';

const createApp = (canvas: HTMLCanvasElement) => {
  return new PIXI.Application({
    backgroundColor: 0x10bb99,
    height: 512 + 128 + 24,
    width: 1024,
    view: canvas,
  });
};

const CanvasComponent = ({ MainComponent }: any) => {
  const [app, setApp] = useState<PIXI.Application>();

  return (
    <canvas
      ref={(canvasRef) => {
        if (!app && canvasRef) {
          setApp(createApp(canvasRef));
        }
      }}
    >
      {app ? <MainComponent app={app} /> : 'Initializing...'}
    </canvas>
  );
};

const renderApp = (Main: React.FC<any>) => {
  ReactDOM.render(<CanvasComponent MainComponent={Main} />, document.getElementById('root'));
};

renderApp(MainStage);

if (module.hot) {
  module.hot.accept('./components/main-stage', () => {
    renderApp(require('./components/main-stage').Stage);
  });
}
