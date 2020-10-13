import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { DroppableContainerInstance } from '../droppable-container/droppable-container';

interface Props extends React.PropsWithChildren<any> {
  app: PIXI.Application;
  transferObject: any;
  scale?: PIXI.Point;
  tags?: ReadonlyArray<string>;
  x?: number;
  y?: number;
  onDragStart?: () => void;
  onDragStop?: () => void;
}

export type DragContainerInstance = PIXI.Container & {
  __transferObject: any;
  __desiredXPos: number;
  __desiredYPos: number;
  __isDragged: boolean;
  __dragStart: (event: any) => void;
  __dragEnd: (e: any) => void;
  __dragMove: (e: any) => void;
  __notifyContainerAt: (
    position: PIXI.Point,
    children?: Array<PIXI.DisplayObject>
  ) => DroppableContainerInstance | undefined;
  __tags: ReadonlyArray<string>;
  __onDragStart?: () => void;
  __onDragStop?: () => void;
  _destroyed: boolean;
  __fromPositionX: number;
  __fromPositionY: number;
};

const TYPE = 'DraggableContainer';
const behavior = {
  customDisplayObject: ({ app }: Props) => {
    const instance = new PIXI.Container() as DragContainerInstance;
    instance.__notifyContainerAt = (
      position,
      children: Array<PIXI.DisplayObject> = app.stage.children
    ) => {
      let onDropToReturn: DroppableContainerInstance | undefined = undefined;
      children.forEach((child) => {
        if ((child as DragContainerInstance).__isDragged) {
          return;
        }
        const dropContainer = child as DroppableContainerInstance;
        const hasOnDrop = dropContainer.__onDrop !== undefined;
        const isInBounds = dropContainer.getBounds().contains(position.x, position.y);
        const matchTags = instance.__tags.every((tag) =>
          (dropContainer.__acceptTags || []).includes(tag)
        );
        if (hasOnDrop && isInBounds && matchTags) {
          onDropToReturn = dropContainer;
        }
        if ((child as PIXI.Container).children) {
          const onDropFromChildren = instance.__notifyContainerAt(
            position,
            (child as PIXI.Container).children
          );
          if (onDropFromChildren) {
            onDropToReturn = onDropFromChildren;
          }
        }
      });
      return onDropToReturn;
    };
    instance.interactive = true;
    instance.cursor = 'pointer';
    instance.zIndex = 1000;
    instance.__isDragged = false;

    let draggedObject: DragContainerInstance | undefined;
    let draggedOverContainer: DroppableContainerInstance | undefined;
    instance.__dragStart = (event: any) => {
      draggedObject = instance;
      draggedObject.zIndex = 2000;
      draggedObject.__isDragged = true;
      draggedObject.__fromPositionX = event.data.global.x;
      draggedObject.__fromPositionY = event.data.global.y;
      if (draggedObject.__onDragStart) {
        draggedObject.__onDragStart();
      }
    };
    instance.__dragEnd = (event: any) => {
      if (draggedObject === undefined) {
        return;
      }
      if (draggedObject.__onDragStop) {
        draggedObject.__onDragStop();
      }
      const container = instance.__notifyContainerAt(event.data.global);
      if (container) {
        if (container.__onDragLeave) {
          container.__onDragLeave(draggedObject.__transferObject);
        }
        container.__onDrop(draggedObject.__transferObject);
      }
      if (draggedObject.visible && !draggedObject._destroyed) {
        draggedObject.zIndex = 1000;
        draggedObject.x = draggedObject.__desiredXPos;
        draggedObject.y = draggedObject.__desiredYPos;
        draggedObject.__isDragged = false;
      }
      draggedObject = undefined;
    };
    instance.__dragMove = (event: any) => {
      if (draggedObject === undefined) {
        return;
      }

      draggedObject.position.x += event.data.global.x - draggedObject.__fromPositionX;
      draggedObject.position.y += event.data.global.y - draggedObject.__fromPositionY;
      draggedObject.__fromPositionX = event.data.global.x;
      draggedObject.__fromPositionY = event.data.global.y;

      const container = instance.__notifyContainerAt(event.data.global);
      if (draggedOverContainer !== container) {
        if (draggedOverContainer && draggedOverContainer.__onDragLeave) {
          draggedOverContainer.__onDragLeave(draggedObject.__transferObject);
        }
        if (container && container.__onDragEnter) {
          container.__onDragEnter(draggedObject.__transferObject);
        }
        draggedOverContainer = container;
      }
    };

    instance.on('mousedown', instance.__dragStart);
    instance.on('mouseup', instance.__dragEnd);
    instance.on('mousemove', instance.__dragMove);
    return instance;
  },
  customApplyProps: function (instance: DragContainerInstance, oldProps: Props, newProps: Props) {
    instance.__transferObject = newProps.transferObject;
    instance.__desiredXPos = newProps.x || 0;
    instance.__desiredYPos = newProps.y || 0;
    instance.__onDragStart = newProps.onDragStart;
    instance.__onDragStop = newProps.onDragStop;

    instance.__tags = newProps.tags || [];
    if (newProps.scale !== undefined) {
      instance.scale = newProps.scale;
    }
    if (!instance.__isDragged) {
      instance.x = newProps.x || 0;
      instance.y = newProps.y || 0;
    }
    // (this as any).applyDisplayObjectProps(oldProps, newProps);
  },
  customWillDetach: (instance: DragContainerInstance) => {
    instance.off('mousedown', instance.__dragStart);
    instance.off('mouseup', instance.__dragEnd);
    instance.off('mousemove', instance.__dragMove);
  },
};

export const DraggableContainer = CustomPIXIComponent<DragContainerInstance, Props>(behavior, TYPE);
