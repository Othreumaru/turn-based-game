import { AttackAction, HealAction, Unit } from '../components/types';
import { getRandomInt, rollChance } from '../utils';

export const attackUnit = (
  sourceUnit: Unit,
  attackAction: AttackAction,
  onAttack: (dmgAmount: number, isCrit: boolean) => void,
  onMiss: () => void
) => {
  let isCrit = false;
  let dmgAmount = 0;
  if (rollChance(sourceUnit.stats.hitChance.current)) {
    const baseDmgAmount = getRandomInt(attackAction.minDmg, attackAction.maxDmg);
    if (rollChance(sourceUnit.stats.critChance.current)) {
      isCrit = true;
      dmgAmount = baseDmgAmount * sourceUnit.stats.critMult.current;
    } else {
      isCrit = false;
      dmgAmount = baseDmgAmount;
    }
    onAttack(dmgAmount, isCrit);
  } else {
    onMiss();
  }
};

export const healUnit = (
  sourceUnit: Unit,
  healAction: HealAction,
  onHeal: (healAmount: number, isCrit: boolean) => void,
  onMiss: () => void
) => {
  let isCrit = false;
  let healAmount = 0;
  if (rollChance(sourceUnit.stats.hitChance.current)) {
    const baseHealAmount = getRandomInt(healAction.minHeal, healAction.maxHeal);
    if (rollChance(sourceUnit.stats.critChance.current)) {
      isCrit = true;
      healAmount = baseHealAmount * sourceUnit.stats.critMult.current;
    } else {
      isCrit = false;
      healAmount = baseHealAmount;
    }
    onHeal(healAmount, isCrit);
  } else {
    onMiss();
  }
};

export const performUnitAction = (
  sourceUnit: Unit,
  onAttack: (dmgAmount: number, isCrit: boolean) => void,
  onHeal: (healAmount: number, isCrit: boolean) => void,
  onMiss: () => void
) => {
  if (sourceUnit.action.type === 'attack-action') {
    attackUnit(sourceUnit, sourceUnit.action, onAttack, onMiss);
  } else if (sourceUnit.action.type === 'heal-action') {
    healUnit(sourceUnit, sourceUnit.action, onHeal, onMiss);
  }
};
