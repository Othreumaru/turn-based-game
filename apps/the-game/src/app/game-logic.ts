import { DmgEffect, Effect, Game, HealEffect, MissEffect, Team, Unit } from '../types';
import * as R from 'ramda';
import { getRandomInt, rollChance } from '../utils/utils';
import { createGoblin, createHealer, createOrc, createWarrior } from './create-units';

const completedTurnUnitIdsLens = R.lensProp('completedTurnUnitIds');
const currentTurnUnitIdLens = R.lensProp('currentTurnUnitId');
const upcomingTurnUnitIdsLens = R.lensProp('upcomingTurnUnitIds');

const sortUnits = (units: Unit[]): Unit[] => {
  return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};

//    removeDefensiveFromUnit :: string -> Game -> Game
const removeDefensiveFromUnit = (unitId: string) => {
  return R.over(R.lensPath(['units', unitId, 'tags']), R.reject(R.equals('defensive')));
};

export const SLOTS: Team = {
  slot00: { id: 'slot00', column: 0, row: 0 },
  slot01: { id: 'slot01', column: 0, row: 1 },
  slot02: { id: 'slot02', column: 0, row: 2 },
  slot10: { id: 'slot10', column: 1, row: 0 },
  slot11: { id: 'slot11', column: 1, row: 1 },
  slot12: { id: 'slot12', column: 1, row: 2 },
};

export const getInitialState = (): Effect[] => {
  const units: Unit[] = [
    createWarrior('slot10'),
    createWarrior('slot11'),
    createWarrior('slot12'),
    createHealer('slot01'),
    createOrc('slot11'),
    createGoblin('slot01'),
  ];
  /* const initiativeSortedUnits: Unit[] = sortUnits(units);
  return {
    units: units.reduce((acc, unit) => {
      acc[unit.id] = unit;
      return acc;
    }, {} as UnitMap),
    completedTurnUnitIds: [],
    currentTurnUnitId: initiativeSortedUnits[0].id,
    upcomingTurnUnitIds: initiativeSortedUnits.slice(1).map((u) => u.id),
    effects: [],
  };
  */
  return units.map((unit) => ({
    type: 'spawn-effect',
    unit,
  }));
};

export const getGame = (effects: Effect[]): Game => {
  const initial: Game = {
    units: {},
    currentTurnUnitId: '',
    completedTurnUnitIds: [],
    upcomingTurnUnitIds: [],
    effects: [],
  };
  return effects.reduce((acc, effect) => {
    switch (effect.type) {
      case 'spawn-effect': {
        const unitIds = sortUnits([
          ...acc.upcomingTurnUnitIds.map((unitId) => acc.units[unitId]),
          effect.unit,
        ]).map((u) => u.id);
        return {
          ...acc,
          units: {
            ...acc.units,
            [effect.unit.id]: effect.unit,
          },
          upcomingTurnUnitIds: acc.currentTurnUnitId === '' ? unitIds.slice(1) : unitIds,
          currentTurnUnitId: acc.currentTurnUnitId === '' ? unitIds[0] : acc.currentTurnUnitId,
        };
      }
      case 'dmg-effect': {
        const newUnits = R.pipe(
          R.map((unit: Unit) => {
            const unitEffect = effect.targets.find((e) => e.unitId === unit.id);
            if (unitEffect) {
              return R.over(
                R.lensPath(['stats', 'hp', 'current']),
                R.add(-unitEffect.dmgAmount),
                unit
              );
            }
            return unit;
          })
        )(acc.units as any) as any;
        return {
          ...acc,
          units: newUnits,
          upcomingTurnUnitIds: acc.upcomingTurnUnitIds.filter(
            (id) => newUnits[id].stats.hp.current > 0
          ),
        };
      }
      case 'end-turn-effect': {
        return nextTurn(acc);
      }
    }
    return acc;
  }, initial);
};

export const nextTurn = (game: Game): Game => {
  if (game.upcomingTurnUnitIds.length) {
    const [current, ...rest] = game.upcomingTurnUnitIds;
    return R.pipe(
      removeDefensiveFromUnit(current),
      R.over(completedTurnUnitIdsLens, R.append(game.currentTurnUnitId)),
      R.set(currentTurnUnitIdLens, current),
      R.set(upcomingTurnUnitIdsLens, rest)
    )(game);
  }
  const initiativeSortedUnitIds = R.pipe(
    R.values,
    sortUnits as any,
    R.map<any, any>(R.prop('id'))
  )(game.units);

  return R.pipe(
    removeDefensiveFromUnit(R.head(initiativeSortedUnitIds)),
    R.set(completedTurnUnitIdsLens, []),
    R.set(currentTurnUnitIdLens, R.head(initiativeSortedUnitIds)),
    R.set(upcomingTurnUnitIdsLens, R.drop(1, initiativeSortedUnitIds))
  )(game);
};

// attackUnit :: Game -> string -> string -> Effect[] -> Effect[]
export const attackUnit = (game: Game) => (sourceId: string) => (targetId: string) => (
  effects: Effect[]
): Effect[] => {
  const sourceUnit = game.units[sourceId];
  const action = sourceUnit.action;
  if (action.type === 'attack-action') {
    return R.ifElse(
      rollChance(sourceUnit.stats.hitChance.current),
      R.ifElse(
        rollChance(sourceUnit.stats.critChance.current),
        R.append<DmgEffect>({
          type: 'dmg-effect',
          sourceUnitId: sourceId,
          targets: [
            {
              unitId: targetId,
              isCrit: true,
              dmgAmount:
                getRandomInt(action.minDmg, action.maxDmg) * sourceUnit.stats.critMult.current,
            },
          ],
        }),
        R.append<DmgEffect>({
          type: 'dmg-effect',
          sourceUnitId: sourceId,
          targets: [
            {
              unitId: targetId,
              isCrit: false,
              dmgAmount: getRandomInt(action.minDmg, action.maxDmg),
            },
          ],
        })
      ),
      R.append<MissEffect>({
        type: 'miss-effect',
        sourceUnitId: sourceId,
        targetUnitIds: [targetId],
      })
    )(effects);
  } else {
    return R.ifElse(
      rollChance(sourceUnit.stats.hitChance.current),
      R.ifElse(
        rollChance(sourceUnit.stats.critChance.current),
        R.append<HealEffect>({
          type: 'heal-effect',
          sourceUnitId: sourceId,
          targets: [
            {
              unitId: targetId,
              isCrit: true,
              healAmount:
                getRandomInt(action.minHeal, action.maxHeal) * sourceUnit.stats.critMult.current,
            },
          ],
        }),
        R.append<HealEffect>({
          type: 'heal-effect',
          sourceUnitId: sourceId,
          targets: [
            {
              unitId: targetId,
              isCrit: false,
              healAmount: getRandomInt(action.minHeal, action.maxHeal),
            },
          ],
        })
      ),
      R.append<MissEffect>({
        type: 'miss-effect',
        sourceUnitId: sourceId,
        targetUnitIds: [targetId],
      })
    )(effects);
  }
};

export const unitIsAlive = (unit: Unit) => unit.stats.hp.current > 0;
export const unitIsDead = (unit: Unit) => !unitIsAlive(unit);

export const takeDefensivePosition = (source: Unit, game: Game): Game => {
  return R.pipe(
    nextTurn,
    R.over(R.lensPath(['units', source.id, 'tags']), (tags) => [...tags, 'defensive'])
  )(game);
};
