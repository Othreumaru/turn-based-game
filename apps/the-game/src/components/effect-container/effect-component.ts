import { TweenManager } from '@zalgoforge/the-tween';
import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as R from 'ramda';
import * as PIXI from 'pixi.js';
import { ChainTween } from './types';

interface Props {
  tweenManager: TweenManager;
  trigger: boolean;
  initialPropValues?: { [key: string]: number };
  onEnter?: ChainTween[];
  onLeave?: ChainTween[];
}

export type EffectContainerInstance = PIXI.Container & {
  customData: {
    tween?: any;
    chainTweens: ChainTween[];
    tweenManager?: TweenManager;
    initialPropValues?: { [key: string]: number };
    processChainTween: () => void;
    reset: () => void;
  };
};

const TYPE = 'EffectComponent';
export const behavior = {
  customDisplayObject: () => {
    const instance = new PIXI.Container() as EffectContainerInstance;
    instance.customData = {
      chainTweens: [],
      reset: () => {
        console.log('RESET CALLED');
        if (instance.customData.tween) {
          instance.customData.tween.stop();
          instance.customData.tween.remove();
        }
        Object.keys(instance.customData.initialPropValues || {}).forEach((key) => {
          (instance as any)[key] = instance.customData.initialPropValues![key];
        });
      },
      processChainTween: () => {
        const { tweenManager, chainTweens, initialPropValues } = instance.customData;
        if (!chainTweens.length || !tweenManager) {
          return;
        }
        const [tweenSequence, ...rest] = chainTweens;

        instance.customData.chainTweens = rest;
        const tween = tweenManager.createTween(instance);
        instance.customData.tween = tween;
        tween
          .from({
            [tweenSequence.prop]: initialPropValues
              ? initialPropValues[tweenSequence.prop] || 0
              : 0,
          })
          .to({ [tweenSequence.prop]: tweenSequence.toValue });
        tween.time = tweenSequence.time;
        tween.on('end', () => {
          if (!instance.customData.chainTweens.length) {
            instance.customData.reset();
          }
          instance.customData.processChainTween();
        });
        tween.start();
      },
    };
    return instance;
  },
  customApplyProps: (instance: EffectContainerInstance, oldProps: Props, newProps: Props) => {
    const { trigger, onEnter, initialPropValues, tweenManager } = newProps;
    if (trigger && onEnter?.length) {
      instance.customData.reset();
      instance.customData.chainTweens = onEnter;
      instance.customData.processChainTween();
    }
    if (!R.equals(newProps.initialPropValues, oldProps.initialPropValues)) {
      instance.customData.initialPropValues = initialPropValues;
      instance.customData.reset();
    }
    instance.customData.tweenManager = tweenManager;
  },
};

export const EffectComponent = CustomPIXIComponent<EffectContainerInstance, Props>(behavior, TYPE);
