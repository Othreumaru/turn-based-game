/// <reference types="react" />
import { TweenManager } from '@zalgoforge/the-tween';
import * as PIXI from 'pixi.js';
import { ChainTween } from './types';
interface Props {
    tweenManager: TweenManager;
    trigger: boolean;
    initialPropValues?: {
        [key: string]: number;
    };
    onEnter?: ChainTween[];
    onLeave?: ChainTween[];
}
export declare type EffectContainerInstance = PIXI.Container & {
    customData: {
        tween?: any;
        chainTweens: ChainTween[];
        tweenManager?: TweenManager;
        initialPropValues?: {
            [key: string]: number;
        };
        processChainTween: () => void;
        reset: () => void;
    };
};
export declare const behavior: {
    customDisplayObject: () => EffectContainerInstance;
    customApplyProps: (instance: EffectContainerInstance, oldProps: Props, newProps: Props) => void;
};
export declare const EffectComponent: import("react-pixi-fiber").PixiComponent<Props & Pick<Partial<import("react-pixi-fiber").WithPointLike<Pick<EffectContainerInstance, "visible" | "alpha" | "x" | "y" | "cursor" | "height" | "position" | "scale" | "transform" | "width" | "zIndex" | "mask" | "children" | "on" | "off" | "sortableChildren" | "sortDirty" | "addChild" | "addChildAt" | "swapChildren" | "getChildIndex" | "setChildIndex" | "getChildAt" | "removeChild" | "removeChildAt" | "removeChildren" | "sortChildren" | "updateTransform" | "calculateBounds" | "getLocalBounds" | "render" | "destroy" | "containerUpdateTransform" | "interactiveChildren" | "getChildByName" | "accessible" | "accessibleTitle" | "accessibleHint" | "_accessibleActive" | "_accessibleDiv" | "accessibleType" | "accessiblePointerEvents" | "accessibleChildren" | "renderable" | "parent" | "worldAlpha" | "filterArea" | "filters" | "_bounds" | "_localBounds" | "isSprite" | "isMask" | "_recursivePostUpdateTransform" | "getBounds" | "toGlobal" | "toLocal" | "setParent" | "setTransform" | "enableTempParent" | "disableTempParent" | "worldTransform" | "localTransform" | "pivot" | "skew" | "rotation" | "angle" | "worldVisible" | "displayObjectUpdateTransform" | "interactive" | "hitArea" | "buttonMode" | "cacheAsBitmap" | "name" | "getGlobalPosition" | "once" | "removeListener" | "removeAllListeners" | "addListener" | "eventNames" | "listeners" | "listenerCount" | "emit" | "customData">>>, "visible" | "alpha" | "x" | "y" | "cursor" | "height" | "position" | "scale" | "transform" | "width" | "zIndex" | "mask" | "on" | "off" | "sortableChildren" | "sortDirty" | "addChild" | "addChildAt" | "swapChildren" | "getChildIndex" | "setChildIndex" | "getChildAt" | "removeChild" | "removeChildAt" | "removeChildren" | "sortChildren" | "updateTransform" | "calculateBounds" | "getLocalBounds" | "render" | "destroy" | "containerUpdateTransform" | "interactiveChildren" | "getChildByName" | "accessible" | "accessibleTitle" | "accessibleHint" | "_accessibleActive" | "_accessibleDiv" | "accessibleType" | "accessiblePointerEvents" | "accessibleChildren" | "renderable" | "parent" | "worldAlpha" | "filterArea" | "filters" | "_bounds" | "_localBounds" | "isSprite" | "isMask" | "_recursivePostUpdateTransform" | "getBounds" | "toGlobal" | "toLocal" | "setParent" | "setTransform" | "enableTempParent" | "disableTempParent" | "worldTransform" | "localTransform" | "pivot" | "skew" | "rotation" | "angle" | "worldVisible" | "displayObjectUpdateTransform" | "interactive" | "hitArea" | "buttonMode" | "cacheAsBitmap" | "name" | "getGlobalPosition" | "once" | "removeListener" | "removeAllListeners" | "addListener" | "eventNames" | "listeners" | "listenerCount" | "emit" | "customData"> & {
    children?: import("react").ReactNode;
}>;
export {};
