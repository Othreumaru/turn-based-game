/// <reference types="react" />
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
export declare type DroppableContainerInstance = PIXI.Graphics & {
    __onDrop: (transferObj: any) => void;
    __acceptTags: string[];
};
export declare const DroppableContainer: import("react-pixi-fiber").PixiComponent<Props & Pick<Partial<import("react-pixi-fiber").WithPointLike<Pick<DroppableContainerInstance, "visible" | "clone" | "alpha" | "fill" | "clear" | "cursor" | "position" | "scale" | "transform" | "zIndex" | "mask" | "line" | "children" | "on" | "off" | "sortableChildren" | "sortDirty" | "addChild" | "addChildAt" | "swapChildren" | "getChildIndex" | "setChildIndex" | "getChildAt" | "removeChild" | "removeChildAt" | "removeChildren" | "sortChildren" | "updateTransform" | "calculateBounds" | "getLocalBounds" | "render" | "destroy" | "containerUpdateTransform" | "interactiveChildren" | "getChildByName" | "accessible" | "accessibleTitle" | "accessibleHint" | "_accessibleActive" | "_accessibleDiv" | "accessibleType" | "accessiblePointerEvents" | "accessibleChildren" | "renderable" | "parent" | "worldAlpha" | "filterArea" | "filters" | "_bounds" | "_localBounds" | "isSprite" | "isMask" | "_recursivePostUpdateTransform" | "getBounds" | "toGlobal" | "toLocal" | "setParent" | "setTransform" | "enableTempParent" | "disableTempParent" | "worldTransform" | "localTransform" | "pivot" | "skew" | "rotation" | "angle" | "worldVisible" | "displayObjectUpdateTransform" | "interactive" | "hitArea" | "buttonMode" | "cacheAsBitmap" | "name" | "getGlobalPosition" | "once" | "removeListener" | "removeAllListeners" | "addListener" | "eventNames" | "listeners" | "listenerCount" | "emit" | "shader" | "state" | "pluginName" | "geometry" | "blendMode" | "tint" | "lineStyle" | "lineTextureStyle" | "moveTo" | "lineTo" | "quadraticCurveTo" | "bezierCurveTo" | "arcTo" | "arc" | "beginFill" | "beginTextureFill" | "endFill" | "drawRect" | "drawRoundedRect" | "drawCircle" | "drawEllipse" | "drawPolygon" | "drawShape" | "drawStar" | "isFastRect" | "_renderDrawCallDirect" | "containsPoint" | "closePath" | "setMatrix" | "beginHole" | "endHole" | "drawChamferRect" | "drawFilletRect" | "drawRegularPolygon" | "drawTorus" | "__onDrop" | "__acceptTags">>>, "visible" | "clone" | "alpha" | "fill" | "clear" | "cursor" | "position" | "scale" | "transform" | "zIndex" | "mask" | "line" | "on" | "off" | "sortableChildren" | "sortDirty" | "addChild" | "addChildAt" | "swapChildren" | "getChildIndex" | "setChildIndex" | "getChildAt" | "removeChild" | "removeChildAt" | "removeChildren" | "sortChildren" | "updateTransform" | "calculateBounds" | "getLocalBounds" | "render" | "destroy" | "containerUpdateTransform" | "interactiveChildren" | "getChildByName" | "accessible" | "accessibleTitle" | "accessibleHint" | "_accessibleActive" | "_accessibleDiv" | "accessibleType" | "accessiblePointerEvents" | "accessibleChildren" | "renderable" | "parent" | "worldAlpha" | "filterArea" | "filters" | "_bounds" | "_localBounds" | "isSprite" | "isMask" | "_recursivePostUpdateTransform" | "getBounds" | "toGlobal" | "toLocal" | "setParent" | "setTransform" | "enableTempParent" | "disableTempParent" | "worldTransform" | "localTransform" | "pivot" | "skew" | "rotation" | "angle" | "worldVisible" | "displayObjectUpdateTransform" | "interactive" | "hitArea" | "buttonMode" | "cacheAsBitmap" | "name" | "getGlobalPosition" | "once" | "removeListener" | "removeAllListeners" | "addListener" | "eventNames" | "listeners" | "listenerCount" | "emit" | "shader" | "state" | "pluginName" | "geometry" | "blendMode" | "tint" | "lineStyle" | "lineTextureStyle" | "moveTo" | "lineTo" | "quadraticCurveTo" | "bezierCurveTo" | "arcTo" | "arc" | "beginFill" | "beginTextureFill" | "endFill" | "drawRect" | "drawRoundedRect" | "drawCircle" | "drawEllipse" | "drawPolygon" | "drawShape" | "drawStar" | "isFastRect" | "_renderDrawCallDirect" | "containsPoint" | "closePath" | "setMatrix" | "beginHole" | "endHole" | "drawChamferRect" | "drawFilletRect" | "drawRegularPolygon" | "drawTorus" | "__onDrop" | "__acceptTags"> & {
    children?: import("react").ReactNode;
}>;
export {};
