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
  onDragEnter?: (targetObj: any) => void;
  onDragLeave?: (targetObj: any) => void;
}

export type DroppableContainerInstance = PIXI.Graphics & {
  __onDrop: (transferObj: any) => void;
  __onDragEnter?: (transferObj: any) => void;
  __onDragLeave?: (transferObj: any) => void;
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
    instance.__onDragEnter = newProps.onDragEnter;
    instance.__onDragLeave = newProps.onDragLeave;
    instance.__acceptTags = newProps.acceptTags || [];
    const { width, height } = newProps;
    if (newProps.debugColor) {
      instance.clear();
      instance.beginFill(newProps.debugColor);
      instance.drawRect(0, 0, width, height);
      instance.endFill();
    }
    (this as any).applyDisplayObjectProps(oldProps, newProps);
  },
};

export const DroppableContainer = CustomPIXIComponent<DroppableContainerInstance, Props>(
  behavior,
  TYPE
);
