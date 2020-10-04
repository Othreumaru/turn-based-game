import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import { MainStage } from './components/main-stage';
import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import { TweenManager } from '@zalgoforge/the-tween';
const tweenManager = new TweenManager();
const size = { width: 1920, height: 1080 };
const ratio = size.width / size.height;
const createApp = (canvas) => {
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
        }
        else {
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
const CanvasComponent = ({ MainComponent }) => {
    const [app, setApp] = useState();
    return (React.createElement("canvas", { ref: (canvasRef) => {
            if (!app && canvasRef) {
                setApp(createApp(canvasRef));
            }
        } }, app ? (React.createElement(MainComponent, { app: app, tweenManager: tweenManager, width: size.width, height: size.height })) : ('Initializing...')));
};
const renderApp = (Main) => {
    ReactDOM.render(React.createElement(CanvasComponent, { MainComponent: Main }), document.getElementById('root'));
};
renderApp(MainStage);
if (module.hot) {
    module.hot.accept('./components/main-stage', () => {
        renderApp(require('./components/main-stage').Stage);
    });
}
//# sourceMappingURL=main.js.map