import { Effect } from '../types';
import { TweenManager } from '@zalgoforge/the-tween';
import React from 'react';
import { ChainTween } from './types';
interface Props {
    tweenManager: TweenManager;
    effects: Effect[];
    triggerOn?: (e: Effect) => boolean;
    initialPropValues?: {
        [key: string]: number;
    };
    children: (effect: Effect) => any;
    onEnter?: ChainTween[];
    onLeave?: ChainTween[];
}
export declare const EffectContainer: React.FC<Props>;
export {};
