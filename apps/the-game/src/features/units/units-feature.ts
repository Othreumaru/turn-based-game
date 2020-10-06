import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DmgEffect, Game, HealEffect, MissEffect, Unit } from '../../components/types';
import * as R from 'ramda';

let initialState: Game = {
  units: {},
  upcomingTurnUnitIds: [],
  currentTurnUnitId: '',
  completedTurnUnitIds: [],
};

const completedTurnUnitIdsLens = R.lensProp('completedTurnUnitIds');
const currentTurnUnitIdLens = R.lensProp('currentTurnUnitId');
const upcomingTurnUnitIdsLens = R.lensProp('upcomingTurnUnitIds');

/**
 *    removeDefensiveFromUnit :: string -> Game -> Game
 */
const removeDefensiveFromUnit = (unitId: string) => {
  return R.over(R.lensPath(['units', unitId, 'tags']), R.reject(R.equals('defensive')));
};

const sortUnits = (units: Unit[]): Unit[] => {
  return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};

export const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    spawnUnits(state, action: PayloadAction<Unit[]>) {
      const units = action.payload;
      const unitIds = sortUnits([
        ...state.upcomingTurnUnitIds.map((unitId) => state.units[unitId]),
        ...units,
      ]).map((u) => u.id);

      units.forEach((unit) => {
        state.units[unit.id] = unit;
      });

      state.upcomingTurnUnitIds = state.currentTurnUnitId === '' ? unitIds.slice(1) : unitIds;
      state.currentTurnUnitId =
        state.currentTurnUnitId === '' ? unitIds[0] : state.currentTurnUnitId;
    },
    endTurn: (state, _: PayloadAction<void>) => {
      if (state.upcomingTurnUnitIds.length) {
        const [current, ...rest] = state.upcomingTurnUnitIds;
        return R.pipe(
          removeDefensiveFromUnit(current),
          R.over(completedTurnUnitIdsLens, R.append(state.currentTurnUnitId)),
          R.set(currentTurnUnitIdLens, current),
          R.set(upcomingTurnUnitIdsLens, rest)
        )(state);
      }
      const initiativeSortedUnitIds = R.pipe(
        R.values,
        sortUnits as any,
        R.map<any, any>(R.prop('id'))
      )(state.units);

      return R.pipe(
        removeDefensiveFromUnit(R.head(initiativeSortedUnitIds)),
        R.set(completedTurnUnitIdsLens, []),
        R.set(currentTurnUnitIdLens, R.head(initiativeSortedUnitIds)),
        R.set(upcomingTurnUnitIdsLens, R.drop(1, initiativeSortedUnitIds))
      )(state);
    },
    dmgUnit: (state, action: PayloadAction<DmgEffect>) => {
      action.payload.targets.forEach((target) => {
        state.units[target.unitId].stats.hp.current -= target.dmgAmount;
      });
      state.upcomingTurnUnitIds = state.upcomingTurnUnitIds.filter(
        (unitId) => state.units[unitId].stats.hp.current > 0
      );
    },
    missUnit: (state, action: PayloadAction<MissEffect>) => {
      action.payload.targetUnitIds.forEach((unitId) => {
        state.units[unitId].stats.missCount.current += 1;
      });
    },
    healUnit: (state, action: PayloadAction<HealEffect>) => {
      action.payload.targets.forEach((target) => {
        state.units[target.unitId].stats.hp.current = Math.min(
          state.units[target.unitId].stats.hp.current + target.healAmount,
          state.units[target.unitId].stats.hp.max
        );
      });
    },
  },
});
