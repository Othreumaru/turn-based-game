import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { TweenManager, Tween } from '@zalgoforge/the-tween';
import { TweenAnimation } from './types';

interface Props {
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
}

class RectGraphics extends PIXI.Graphics {
  __tween?: Tween;

  fillColor?: number;
  lineColor?: number;
  lineWidth?: number;

  constructor(geometry?: PIXI.GraphicsGeometry) {
    super(geometry);
  }

  startAnimation(tweenManager: TweenManager, animation: TweenAnimation) {
    if (this.__tween) {
      this.__tween.stop();
      this.__tween.remove();
    }
    this.__tween = tweenManager.createTween(this);
    this.__tween.time = animation.duration;
    this.__tween.loop = animation.loop;
    this.__tween.pingPong = animation.pingPong;
    this.__tween.from(animation.keyframes.from);
    this.__tween.to(animation.keyframes.to);

    this.__tween.interpolators({
      lineColor: (from: number, to: number, t: number) => {
        const fromRGB = [(from & 0xff0000) >> 16, (from & 0x00ff00) >> 8, from & 0x0000ff];
        const toRGB = [(to & 0xff0000) >> 16, (to & 0x00ff00) >> 8, to & 0x0000ff];
        const result = fromRGB.map((fromRGB, index) =>
          Math.floor(fromRGB + (toRGB[index] - fromRGB) * t)
        );
        return (result[0] << 16) + (result[1] << 8) + result[2];
      },
    });
    this.__tween.start();
  }

  _render(renderer: PIXI.Renderer) {
    super._render(renderer);
    this.clear();
    if (this.lineColor || this.lineWidth) {
      this.lineStyle(this.lineWidth || 1, this.lineColor || 0x00ff00);
    }
    if (this.fillColor) {
      this.beginFill(this.fillColor);
    }
    this.drawRect(0, 0, (this as any)._width, (this as any)._height);
    if (this.fillColor) {
      this.endFill();
    }
  }
}

const TYPE = 'Rect';
export const behavior = {
  customDisplayObject: () => new RectGraphics(),
  customApplyProps: function (instance: RectGraphics, oldProps: Props, newProps: Props) {
    if (newProps.tweenManager && newProps.animation && oldProps.animation !== newProps.animation) {
      instance.startAnimation(newProps.tweenManager, newProps.animation);
    }
    (this as any).applyDisplayObjectProps(oldProps, newProps);
  },
};

export const Rect = CustomPIXIComponent<RectGraphics, Props>(behavior, TYPE);
