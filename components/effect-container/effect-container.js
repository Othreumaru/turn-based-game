import React, { useRef } from 'react';
import { EffectComponent } from './effect-component';
export const EffectContainer = (props) => {
    const { children, effects, triggerOn, tweenManager, initialPropValues, onEnter } = props;
    const prevEffects = useRef([]);
    const eventsToTrigger = useRef([]);
    const unprocessedEffects = effects.slice(prevEffects.current.length);
    const activeEvents = triggerOn && unprocessedEffects.filter(triggerOn);
    eventsToTrigger.current = activeEvents?.length ? activeEvents : eventsToTrigger.current;
    prevEffects.current = effects;
    return (React.createElement(EffectComponent, { tweenManager: tweenManager, trigger: activeEvents !== undefined && activeEvents.length >= 1, initialPropValues: initialPropValues, onEnter: onEnter }, typeof children === 'function' && eventsToTrigger.current.length
        ? children(eventsToTrigger.current[0])
        : null));
};
//# sourceMappingURL=effect-container.js.map