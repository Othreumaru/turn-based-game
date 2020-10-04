import * as PIXI from 'pixi.js';
import * as React from 'react';
import { DroppableContainerInstance } from '../droppable-container/droppable-container';
interface Props extends React.PropsWithChildren<any> {
    app: PIXI.Application;
    transferObject: any;
    scale?: PIXI.Point;
    tags?: ReadonlyArray<string>;
    x: number;
    y: number;
    onDragStart?: () => void;
    onDragStop?: () => void;
}
export declare type DragContainerInstance = PIXI.Container & {
    __transferObject: any;
    __desiredXPos: number;
    __desiredYPos: number;
    __isDragged: boolean;
    __dragStart: () => void;
    __dragEnd: (e: any) => void;
    __dragMove: (e: any) => void;
    __notifyContainerAt: (position: PIXI.Point, children?: Array<PIXI.DisplayObject>) => DroppableContainerInstance | undefined;
    __tags: ReadonlyArray<string>;
    __onDragStart?: () => void;
    __onDragStop?: () => void;
    _destroyed: boolean;
};
export declare const DraggableContainer: import("react-pixi-fiber").PixiComponent<Props & Pick<Partial<import("react-pixi-fiber").WithPointLike<Pick<DragContainerInstance, never>>>, never> & {
    children?: React.ReactNode;
}>;
export {};
