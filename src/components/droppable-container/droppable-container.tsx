import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  debugColor?: number;
  acceptTags?: string[];
  onDrop: (targetObj: any) => void;
}

export type DroppableContainerInstance = PIXI.Graphics & {
  __onDrop: (transferObj: any) => void;
  __acceptTags: string[];
};

const TYPE = 'DroppableContainer';
const behavior = {
  customDisplayObject: () => new PIXI.Graphics(),
  customApplyProps: function (
    instance: DroppableContainerInstance,
    oldProps: Props,
    newProps: Props
  ) {
    instance.__onDrop = newProps.onDrop;
    instance.__acceptTags = newProps.acceptTags || [];
    const { width, height } = newProps;
    instance.clear();
    instance.beginFill(newProps.debugColor || 0x00ff00);
    instance.drawRect(0, 0, width, height);
    instance.endFill();
    (this as any).applyDisplayObjectProps(oldProps, newProps);
  },
};

export const DroppableContainer = CustomPIXIComponent<DroppableContainerInstance, Props>(
  behavior,
  TYPE
);
