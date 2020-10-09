import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DmgEffect, Game, HealEffect, MissEffect, Unit } from '../../components/types';
import * as R from 'ramda';

let initialState: Game = {
  units: {},
  upcomingTurnUnitIds: [],
  currentTurnUnitId: '',
  completedTurnUnitIds: [],
};

const sortUnits = (units: Unit[]): Unit[] => {
  return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};

const mutableEndTurn = (state: Game) => {
  if (state.upcomingTurnUnitIds.length) {
    const [current, ...rest] = state.upcomingTurnUnitIds;
    state.units[current].tags = state.units[current].tags.filter((t) => t !== 'defensive');
    state.completedTurnUnitIds.push(state.currentTurnUnitId);
    state.currentTurnUnitId = current;
    state.upcomingTurnUnitIds = rest;
    return;
  }
  const initiativeSortedUnitIds: string[] = R.pipe(
    R.values,
    sortUnits as any,
    R.map<any, any>(R.prop('id')),
    R.filter((unitId: string) => state.units[unitId].stats.hp.current > 0)
  )(state.units);

  const [current, ...rest] = initiativeSortedUnitIds;
  state.completedTurnUnitIds = [];
  state.currentTurnUnitId = current;
  state.upcomingTurnUnitIds = rest;
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
      mutableEndTurn(state);
    },
    dmgUnit: (state, action: PayloadAction<DmgEffect>) => {
      state.units[action.payload.sourceUnitId].stats.attackCount.current += 1;
      action.payload.targets.forEach((target) => {
        state.units[target.unitId].stats.hp.current -= target.dmgAmount;
      });
      state.upcomingTurnUnitIds = state.upcomingTurnUnitIds.filter(
        (unitId) => state.units[unitId].stats.hp.current > 0
      );
      mutableEndTurn(state);
    },
    missUnit: (state, action: PayloadAction<MissEffect>) => {
      state.units[action.payload.sourceUnitId].stats.attackCount.current += 1;
      action.payload.targetUnitIds.forEach((unitId) => {
        state.units[unitId].stats.missCount.current += 1;
      });
      mutableEndTurn(state);
    },
    healUnit: (state, action: PayloadAction<HealEffect>) => {
      action.payload.targets.forEach((target) => {
        state.units[target.unitId].stats.hp.current = Math.min(
          state.units[target.unitId].stats.hp.current + target.healAmount,
          state.units[target.unitId].stats.hp.max
        );
      });
      mutableEndTurn(state);
    },
  },
});
