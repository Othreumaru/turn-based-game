import { v4 as uuidv4 } from 'uuid';
import { AttackAction } from './types';

export const createAttackAction = (
  range: 'closest' | 'self' | 'any' | 'all' = 'closest'
): AttackAction => {
  return {
    id: uuidv4(),
    type: 'attack-action',
    name: 'Sword Swing',
    range,
    targetTeam: 'enemy',
    description: 'Deals {minDmg} to {maxDmg} to closest enemy',
    minDmg: 22,
    maxDmg: 28,
  };
};

export const createDefensiveStanceAction = () => {
  return {
    id: uuidv4(),
    type: 'defensive-stance-action',
    name: 'Defensive Stance',
    range: 'self',
    targetTeam: 'player',
    description: 'Allows unit to take 50% dmg until next turn',
  };
};

export const createHealAction = () => {
  return {
    id: uuidv4(),
    type: 'heal-action',
    name: 'Heal',
    targetTeam: 'player',
    range: 'any',
    description: 'Heal player unit for {minHeal} to {maxHeal}',
    minHeal: 22,
    maxHeal: 28,
  };
};
