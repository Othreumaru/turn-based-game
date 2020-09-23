import { DmgEffect, Effect, Game, MissEffect, Team, Unit } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import { rollChance } from '../utils/utils';

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
    {
      id: uuidv4(),
      name: 'warrior',
      team: 'player',
      slotId: 'slot10',
      stats: {
        hp: { current: 120, max: 120 },
        level: { current: 1, max: 60 },
        xp: { current: 0, max: 1000 },
        initiative: { current: 70, max: 100 },
      },
      tags: [],
    },
    {
      id: uuidv4(),
      name: 'warrior',
      team: 'player',
      slotId: 'slot11',
      stats: {
        hp: { current: 120, max: 120 },
        level: { current: 1, max: 60 },
        xp: { current: 0, max: 1000 },
        initiative: { current: 70, max: 100 },
      },
      tags: [],
    },
    {
      id: uuidv4(),
      name: 'warrior',
      team: 'player',
      slotId: 'slot12',
      stats: {
        hp: { current: 120, max: 120 },
        level: { current: 1, max: 60 },
        xp: { current: 0, max: 1000 },
        initiative: { current: 70, max: 100 },
      },
      tags: [],
    },
    {
      id: uuidv4(),
      name: 'healer',
      team: 'player',
      slotId: 'slot01',
      stats: {
        hp: { current: 120, max: 120 },
        level: { current: 1, max: 60 },
        xp: { current: 0, max: 1000 },
        initiative: { current: 30, max: 100 },
      },
      tags: [],
    },
    {
      id: uuidv4(),
      name: 'orc',
      team: 'enemy',
      slotId: 'slot11',
      stats: {
        hp: { current: 120, max: 120 },
        level: { current: 1, max: 60 },
        xp: { current: 0, max: 1000 },
        initiative: { current: 40, max: 100 },
      },
      tags: [],
    },
    {
      id: uuidv4(),
      name: 'goblin',
      team: 'enemy',
      slotId: 'slot01',
      stats: {
        hp: { current: 120, max: 120 },
        level: { current: 1, max: 60 },
        xp: { current: 0, max: 1000 },
        initiative: { current: 40, max: 100 },
      },
      tags: [],
    },
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
        return {
          ...acc,
          units: R.map((unit: Unit) => {
            const unitEffect = effect.targets.find((e) => e.unitId === unit.id);
            if (unitEffect) {
              return R.over(
                R.lensPath(['stats', 'hp', 'current']),
                R.add(-unitEffect.dmgAmount),
                unit
              );
            }
            return unit;
          })(acc.units as any) as any,
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

// attackUnit :: string -> string -> Game -> Game
export const attackUnit = (sourceId: string) => (targetId: string) => (roll: number) => (
  effects: Effect[]
): Effect[] => {
  return R.ifElse(
    rollChance(roll, 0.8),
    R.append<DmgEffect>({
      type: 'dmg-effect',
      sourceUnitId: sourceId,
      targets: [
        {
          unitId: targetId,
          dmgAmount: 10,
        },
      ],
    }),
    R.append<MissEffect>({
      type: 'miss-effect',
      sourceUnitId: sourceId,
      targetUnitIds: [targetId],
    })
  )(effects);
};

export const takeDefensivePosition = (source: Unit, game: Game): Game => {
  return R.pipe(
    nextTurn,
    R.over(R.lensPath(['units', source.id, 'tags']), (tags) => [...tags, 'defensive'])
  )(game);
};
