import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

interface Props {
  x?: number;
  y?: number;
  fillColor?: number;
  lineColor?: number;
  lineWidth?: number;
  alpha?: number;
  width: number;
  height: number;
  radius?: number;
}

const TYPE = 'Rect';
export const behavior = {
  customDisplayObject: () => {
    return new PIXI.Graphics();
  },
  customApplyProps: function (instance: PIXI.Graphics, oldProps: Props, newProps: Props) {
    instance.clear();
    if (newProps.lineColor || newProps.lineWidth) {
      instance.lineStyle(newProps.lineWidth || 1, newProps.lineColor || 0x00ff00);
    }
    if (newProps.fillColor) {
      instance.beginFill(newProps.fillColor);
    }
    instance.drawRoundedRect(0, 0, newProps.width, newProps.height, newProps.radius || 0);
    if (newProps.fillColor) {
      instance.endFill();
    }
    (this as any).applyDisplayObjectProps(oldProps, newProps);
  },
};

export const Rect = CustomPIXIComponent<PIXI.Graphics, Props>(behavior, TYPE);
