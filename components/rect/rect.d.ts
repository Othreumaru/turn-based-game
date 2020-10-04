/// <reference types="react" />
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
declare class RectGraphics extends PIXI.Graphics {
    __tween?: Tween;
    fillColor?: number;
    lineColor?: number;
    lineWidth?: number;
    constructor(geometry?: PIXI.GraphicsGeometry);
    startAnimation(tweenManager: TweenManager, animation: TweenAnimation): void;
    _render(renderer: PIXI.Renderer): void;
}
export declare const behavior: {
    customDisplayObject: () => RectGraphics;
    customApplyProps: (instance: RectGraphics, oldProps: Props, newProps: Props) => void;
};
export declare const Rect: import("react-pixi-fiber").PixiComponent<Props & Pick<Partial<import("react-pixi-fiber").WithPointLike<Pick<RectGraphics, "visible" | "clone" | "fill" | "clear" | "cursor" | "position" | "scale" | "transform" | "zIndex" | "mask" | "line" | "children" | "on" | "off" | "sortableChildren" | "sortDirty" | "addChild" | "addChildAt" | "swapChildren" | "getChildIndex" | "setChildIndex" | "getChildAt" | "removeChild" | "removeChildAt" | "removeChildren" | "sortChildren" | "updateTransform" | "calculateBounds" | "getLocalBounds" | "render" | "destroy" | "containerUpdateTransform" | "interactiveChildren" | "getChildByName" | "accessible" | "accessibleTitle" | "accessibleHint" | "_accessibleActive" | "_accessibleDiv" | "accessibleType" | "accessiblePointerEvents" | "accessibleChildren" | "renderable" | "parent" | "worldAlpha" | "filterArea" | "filters" | "_bounds" | "_localBounds" | "isSprite" | "isMask" | "_recursivePostUpdateTransform" | "getBounds" | "toGlobal" | "toLocal" | "setParent" | "setTransform" | "enableTempParent" | "disableTempParent" | "worldTransform" | "localTransform" | "pivot" | "skew" | "rotation" | "angle" | "worldVisible" | "displayObjectUpdateTransform" | "interactive" | "hitArea" | "buttonMode" | "cacheAsBitmap" | "name" | "getGlobalPosition" | "once" | "removeListener" | "removeAllListeners" | "addListener" | "eventNames" | "listeners" | "listenerCount" | "emit" | "shader" | "state" | "pluginName" | "geometry" | "blendMode" | "tint" | "lineStyle" | "lineTextureStyle" | "moveTo" | "lineTo" | "quadraticCurveTo" | "bezierCurveTo" | "arcTo" | "arc" | "beginFill" | "beginTextureFill" | "endFill" | "drawRect" | "drawRoundedRect" | "drawCircle" | "drawEllipse" | "drawPolygon" | "drawShape" | "drawStar" | "isFastRect" | "_renderDrawCallDirect" | "containsPoint" | "closePath" | "setMatrix" | "beginHole" | "endHole" | "drawChamferRect" | "drawFilletRect" | "drawRegularPolygon" | "drawTorus" | "__tween" | "startAnimation" | "_render">>>, "visible" | "clone" | "fill" | "clear" | "cursor" | "position" | "scale" | "transform" | "zIndex" | "mask" | "line" | "on" | "off" | "sortableChildren" | "sortDirty" | "addChild" | "addChildAt" | "swapChildren" | "getChildIndex" | "setChildIndex" | "getChildAt" | "removeChild" | "removeChildAt" | "removeChildren" | "sortChildren" | "updateTransform" | "calculateBounds" | "getLocalBounds" | "render" | "destroy" | "containerUpdateTransform" | "interactiveChildren" | "getChildByName" | "accessible" | "accessibleTitle" | "accessibleHint" | "_accessibleActive" | "_accessibleDiv" | "accessibleType" | "accessiblePointerEvents" | "accessibleChildren" | "renderable" | "parent" | "worldAlpha" | "filterArea" | "filters" | "_bounds" | "_localBounds" | "isSprite" | "isMask" | "_recursivePostUpdateTransform" | "getBounds" | "toGlobal" | "toLocal" | "setParent" | "setTransform" | "enableTempParent" | "disableTempParent" | "worldTransform" | "localTransform" | "pivot" | "skew" | "rotation" | "angle" | "worldVisible" | "displayObjectUpdateTransform" | "interactive" | "hitArea" | "buttonMode" | "cacheAsBitmap" | "name" | "getGlobalPosition" | "once" | "removeListener" | "removeAllListeners" | "addListener" | "eventNames" | "listeners" | "listenerCount" | "emit" | "shader" | "state" | "pluginName" | "geometry" | "blendMode" | "tint" | "lineStyle" | "lineTextureStyle" | "moveTo" | "lineTo" | "quadraticCurveTo" | "bezierCurveTo" | "arcTo" | "arc" | "beginFill" | "beginTextureFill" | "endFill" | "drawRect" | "drawRoundedRect" | "drawCircle" | "drawEllipse" | "drawPolygon" | "drawShape" | "drawStar" | "isFastRect" | "_renderDrawCallDirect" | "containsPoint" | "closePath" | "setMatrix" | "beginHole" | "endHole" | "drawChamferRect" | "drawFilletRect" | "drawRegularPolygon" | "drawTorus" | "__tween" | "startAnimation" | "_render"> & {
    children?: import("react").ReactNode;
}>;
export {};
