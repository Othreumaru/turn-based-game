import * as React from 'react';
import * as PIXI from 'pixi.js';
import { TweenManager } from '@zalgoforge/the-tween';
interface Props {
    app: PIXI.Application;
    tweenManager: TweenManager;
    width: number;
    height: number;
}
export declare const MainStage: React.FC<Props>;
export {};
