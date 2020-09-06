import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

interface Props {
  x?: number;
  y?: number;
  fill: number;
  width: number;
  height: number;
}

const TYPE = 'Rect';
export const behavior = {
  customDisplayObject: () => new PIXI.Graphics(),
  customApplyProps: (instance: PIXI.Graphics, oldProps: Props, newProps: Props) => {
    const { fill, x, y, width, height } = newProps;
    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x || 0, y || 0, width, height);
    instance.endFill();
  },
};

export const Rect = CustomPIXIComponent<PIXI.Graphics, Props>(behavior, TYPE);
