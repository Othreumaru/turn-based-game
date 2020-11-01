import { v4 as uuidv4 } from 'uuid';
import { BasicAction, StatModifier, TargetTeam, Range } from './types';

export const createBasicAction = (targetTeam: TargetTeam) => (range: Range) => (name: string) => (
  props: StatModifier[]
): BasicAction => {
  return {
    id: uuidv4(),
    type: 'basic-action',
    name,
    targetTeam,
    range,
    props,
  };
};

export const createBasicEnemyAction = createBasicAction('enemy');
export const createBasicPlayerAction = createBasicAction('player');
