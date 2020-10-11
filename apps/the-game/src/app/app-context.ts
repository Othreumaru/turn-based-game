import { TweenManager } from '@zalgoforge/the-tween';
import * as React from 'react';
export const AppContext = React.createContext<{
  app: PIXI.Application;
  tweenManager: TweenManager;
}>({
  app: undefined,
  tweenManager: undefined,
} as any);
