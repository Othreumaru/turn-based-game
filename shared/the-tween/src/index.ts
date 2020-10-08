import * as PIXI from 'pixi.js';

import TweenManager from './TweenManager';
import Tween from './Tween';
import TweenPath from './TweenPath';
import Easing from './Easing';
import { TweenAnimation } from './types';

//extend pixi graphics to draw tweenPaths
(PIXI.Graphics.prototype as any).drawPath = function (path: TweenPath) {
  path.parsePoints();
  this.drawShape(path.polygon);
  return this;
};

export { TweenManager, Tween, TweenPath, Easing, TweenAnimation };
