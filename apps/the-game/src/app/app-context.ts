import { TweenManager } from '@zalgoforge/the-tween';
import * as React from 'react';
export const AppContext = React.createContext<{
  app: PIXI.Application;
  tweenManager: TweenManager;
  width: number;
  height: number;
}>({
  app: undefined,
  tweenManager: undefined,
} as any);
