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
}

const TYPE = 'Rect';
export const behavior = {
  customDisplayObject: () => new PIXI.Graphics(),
  customApplyProps: (instance: PIXI.Graphics, oldProps: Props, newProps: Props) => {
    const { fillColor, lineColor, lineWidth = 1, x, y, width, height, alpha } = newProps;
    instance.clear();
    if (lineColor || lineWidth) {
      instance.lineStyle(lineWidth || 1, lineColor || 0x00ff00);
    }
    if (fillColor) {
      instance.beginFill(fillColor);
    }
    instance.drawRect(x || 0, y || 0, width, height);
    if (fillColor) {
      instance.endFill();
    }
    if (alpha !== undefined) {
      instance.alpha = alpha;
    }
  },
};

export const Rect = CustomPIXIComponent<PIXI.Graphics, Props>(behavior, TYPE);
