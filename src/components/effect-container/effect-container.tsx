import { Effect } from '../types';
import TweenManager from '../../tween/TweenManager';
import React, { useRef } from 'react';
import { ChainTween } from './types';
import { EffectComponent } from './effect-component';

interface Props {
  tweenManager: TweenManager;
  effects: Effect[];
  triggerOn?: (e: Effect) => boolean;
  initialPropValues?: { [key: string]: number };
  children: (effect: Effect) => any;
  onEnter?: ChainTween[];
  onLeave?: ChainTween[];
}

export const EffectContainer: React.FC<Props> = (props) => {
  const { children, effects, triggerOn, tweenManager, initialPropValues, onEnter } = props;
  const prevEffects = useRef<Effect[]>([]);
  const eventsToTrigger = useRef<Effect[]>([]);

  const unprocessedEffects: Effect[] = effects.slice(prevEffects.current.length);
  const activeEvents = triggerOn && unprocessedEffects.filter(triggerOn);
  eventsToTrigger.current = activeEvents?.length ? activeEvents : eventsToTrigger.current;

  prevEffects.current = effects;
  return (
    <EffectComponent
      tweenManager={tweenManager}
      trigger={activeEvents !== undefined && activeEvents.length >= 1}
      initialPropValues={initialPropValues}
      onEnter={onEnter}
    >
      {typeof children === 'function' && eventsToTrigger.current.length
        ? children(eventsToTrigger.current[0])
        : null}
    </EffectComponent>
  );
};
