import { v4 as uuidv4 } from 'uuid';
import { AttackAction, DefensiveStanceAction, HealAction } from './types';

export const createAttackAction = (
  name: string,
  range: 'closest' | 'self' | 'any' | 'all' = 'closest',
  dmg: number
): AttackAction => {
  return {
    id: uuidv4(),
    type: 'attack-action',
    name,
    range,
    targetTeam: 'enemy',
    description: 'Deals {dmg} to {range} enemy, +1 threat',
    dmg,
    threat: 1,
  };
};

export const createDefensiveStanceAction = (): DefensiveStanceAction => {
  return {
    id: uuidv4(),
    type: 'defensive-stance-action',
    name: 'Defensive Stance',
    range: 'self',
    targetTeam: 'player',
    description: 'Give 1 shield, +2 threat',
    threat: 2,
    shieldAmount: 2,
  };
};

export const createHealAction = (): HealAction => {
  return {
    id: uuidv4(),
    type: 'heal-action',
    name: 'Heal',
    targetTeam: 'player',
    range: 'any',
    description: 'Heal player unit for {minHeal} to {maxHeal}',
    heal: 3,
    threat: 1,
  };
};
