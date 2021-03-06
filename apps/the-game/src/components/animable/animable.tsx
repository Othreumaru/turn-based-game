import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { TweenManager, Tween, TweenAnimation } from '@zalgoforge/the-tween';

export interface AnimableProps {
  x?: number;
  y?: number;
  fillColor?: number;
  lineColor?: number;
  lineWidth?: number;
  alpha?: number;
  width: number;
  height: number;
  tweenManager?: TweenManager;
  animation?: TweenAnimation;
  animationTrigger?: any;
}

export interface AnimableInstance extends PIXI.Graphics {
  __custom: {
    tween: Tween | undefined;
    render: (obj: any) => void;
    startTween: (tweenManager: TweenManager, animation: TweenAnimation, newProps: any) => void;
    destroyTween: () => void;
  };
}

const TYPE = 'Animable';
export const behavior = {
  customDisplayObject: () => {
    const instance = new PIXI.Graphics() as AnimableInstance;
    instance.__custom = {
      tween: undefined,
      destroyTween: () => {
        if (instance.__custom.tween !== undefined) {
          instance.__custom.tween.stop();
          instance.__custom.tween.remove();
          instance.__custom.tween = undefined;
        }
      },
      startTween: (tweenManager: TweenManager, animation: TweenAnimation, newProps: any) => {
        instance.__custom.tween = tweenManager.createTween(animation);
        instance.__custom.tween.start();
        instance.__custom.tween.interpolators({
          lineColor: (from: number, to: number, t: number) => {
            const fromRGB = [(from & 0xff0000) >> 16, (from & 0x00ff00) >> 8, from & 0x0000ff];
            const toRGB = [(to & 0xff0000) >> 16, (to & 0x00ff00) >> 8, to & 0x0000ff];
            const result = fromRGB.map((fromRGB, index) =>
              Math.floor(fromRGB + (toRGB[index] - fromRGB) * t)
            );
            return (result[0] << 16) + (result[1] << 8) + result[2];
          },
        });
        instance.__custom.tween.on('update', (time: number, obj: any) => {
          if ((instance as any)._destroyed) {
            instance.__custom.destroyTween();
            return;
          }
          if (obj.x !== undefined) {
            instance.x = obj.x;
          }
          if (obj.y !== undefined) {
            instance.y = obj.y;
          }
          if (obj.width !== undefined) {
            instance.width = obj.width;
          }
          if (obj.height !== undefined) {
            instance.height = obj.height;
          }
          if (obj.alpha !== undefined) {
            instance.alpha = obj.alpha;
          }
          instance.__custom.render({ ...newProps, ...obj });
        });
      },
      render: (obj: any) => {
        instance.clear();
        if (obj.lineColor || obj.lineWidth) {
          instance.lineStyle(obj.lineWidth || 1, obj.lineColor || 0x00ff00);
        }
        if (obj.fillColor) {
          instance.beginFill(obj.fillColor);
        }
        instance.drawRect(0, 0, obj.width, obj.height);
        if (obj.fillColor) {
          instance.endFill();
        }
      },
    };
    return instance;
  },
  customApplyProps: function (
    instance: AnimableInstance,
    oldProps: AnimableProps,
    newProps: AnimableProps
  ) {
    if (
      newProps.tweenManager &&
      newProps.animation &&
      oldProps.animationTrigger !== undefined &&
      oldProps.animationTrigger !== newProps.animationTrigger
    ) {
      instance.__custom.destroyTween();
      instance.__custom.startTween(newProps.tweenManager, newProps.animation, newProps);
    }
    if (
      newProps.animationTrigger === undefined &&
      newProps.tweenManager &&
      newProps.animation &&
      oldProps.animation !== newProps.animation
    ) {
      instance.__custom.destroyTween();
      instance.__custom.startTween(newProps.tweenManager, newProps.animation, newProps);
    } else if (
      newProps.animationTrigger !== undefined ||
      !newProps.animation ||
      !newProps.tweenManager
    ) {
      instance.__custom.render(newProps);
      (this as any).applyDisplayObjectProps(oldProps, newProps);
    }
  },
  customWillDetach: (instance: AnimableInstance) => {
    instance.__custom.destroyTween();
  },
};

export const Animable = CustomPIXIComponent<AnimableInstance, AnimableProps>(behavior, TYPE);
