import { Game, Unit, UnitMap } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';
import { rollChance } from '../utils/utils';

const completedTurnUnitIdsLens = R.lensProp('completedTurnUnitIds');
const currentTurnUnitIdLens = R.lensProp('currentTurnUnitId');
const upcomingTurnUnitIdsLens = R.lensProp('upcomingTurnUnitIds');
const effectsLens = R.lensProp('effects');

const sortUnits = (units: Unit[]): Unit[] => {
  return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};

//    removeDefensiveFromUnit :: string -> Game -> Game
const removeDefensiveFromUnit = (unitId: string) => {
  return R.over(R.lensPath(['units', unitId, 'tags']), R.reject(R.equals('defensive')));
};

export const getInitialState = (): Game => {
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
  const initiativeSortedUnits: Unit[] = sortUnits(units);
  return {
    units: units.reduce((acc, unit) => {
      acc[unit.id] = unit;
      return acc;
    }, {} as UnitMap),
    slots: {
      slot00: { id: 'slot00', column: 0, row: 0 },
      slot01: { id: 'slot01', column: 0, row: 1 },
      slot02: { id: 'slot02', column: 0, row: 2 },
      slot10: { id: 'slot10', column: 1, row: 0 },
      slot11: { id: 'slot11', column: 1, row: 1 },
      slot12: { id: 'slot12', column: 1, row: 2 },
    },
    completedTurnUnitIds: [],
    currentTurnUnitId: initiativeSortedUnits[0].id,
    upcomingTurnUnitIds: initiativeSortedUnits.slice(1).map((u) => u.id),
    effects: [],
  };
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
export const attackUnit = (sourceId: string) => (targetId: string) => (game: Game): Game => {
  return R.pipe(
    nextTurn,
    R.over(
      effectsLens,
      R.ifElse(
        rollChance(0.8),
        R.append({
          type: 'dmg-effect',
          sourceUnitId: sourceId,
          targets: [
            {
              unitId: targetId,
              dmg: 10,
            },
          ],
        }),
        R.append({
          type: 'miss-effect',
          sourceUnitId: sourceId,
          targetUnitIds: [targetId],
        })
      )
    )
  )(game);
};

export const takeDefensivePosition = (source: Unit, game: Game): Game => {
  return R.pipe(
    nextTurn,
    R.over(R.lensPath(['units', source.id, 'tags']), (tags) => [...tags, 'defensive'])
  )(game);
};
