import * as React from 'react';
import { Effect } from '../types';

interface Props {
  effects: Effect[];
  triggerOn: string;
  children: (data: Effect) => any;
}

/**
 * Example
 * <EffectContainer
      effects={state.effects}
      triggerOn={(effect: Effect) =>
            effect.type === 'miss-effect' && effect.targetUnitIds.includes(state.currentTurnUnitId)
      }
      transition={[{ alpha: 0 }, { alpha: 1, duration: 1000 }, { alpha: 0 }]} />
 >
 *
 * @param children
 * @constructor
 */

export const EffectContainer: React.FC<Props> = ({}) => {
  return <></>;
};
