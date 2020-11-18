import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Battle, Turn } from './types';
import { ExecuteActionArgs, getSlotIdToUnitMap, Unit, unitIsEnemy, unitIsPlayer } from '../units';
import * as R from 'ramda';

let initialState: Battle = {
  turnCount: 0,
  units: {},
  upcomingTurns: [],
  currentTurn: undefined,
  completedTurns: [],
};

const unitToTurn = (unit: Unit): Turn => ({ unitId: unit.id, selectedActionIndex: 0 });

const mutableEndTurn = (state: Battle) => {
  if (state.currentTurn && state.upcomingTurns.length) {
    const [current, ...rest] = state.upcomingTurns;
    state.units[current.unitId].tags = state.units[current.unitId].tags.filter(
      (t) => t !== 'defensive'
    );
    state.completedTurns.push(state.currentTurn);
    state.currentTurn = current;
    state.upcomingTurns = rest;
    return;
  }
  const initiativeSortedUnits: Unit[] = R.pipe(
    R.values,
    R.filter((unit: Unit) => unit.stats.hp.current > 0) as any,
    sortUnits
  )(state.units);

  const [current, ...rest] = initiativeSortedUnits;
  if (current) {
    state.completedTurns = [];
    state.currentTurn = unitToTurn(current);
    state.upcomingTurns = rest.map(unitToTurn);
    state.turnCount += 1;
    state.units[current.id].buffs = [];
  }
};

const sortUnits = (units: Unit[]): Unit[] => {
  return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};

export const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<Dictionary<Unit>>) => {
      state.units = action.payload;
      const players = Object.values(state.units).filter((u) => unitIsPlayer(u) || unitIsEnemy(u));
      const units = sortUnits([
        ...state.upcomingTurns.map((turn) => state.units[turn.unitId]),
        ...players,
      ]);

      state.upcomingTurns =
        state.currentTurn === undefined ? units.slice(1).map(unitToTurn) : units.map(unitToTurn);
      state.currentTurn =
        state.currentTurn === undefined ? unitToTurn(units[0]) : state.currentTurn;
    },
    endTurn: (state, _: PayloadAction<void>) => {
      mutableEndTurn(state);
    },
    executeCurrentUnitAction: (state, action: PayloadAction<ExecuteActionArgs>) => {
      if (!state.currentTurn) {
        return;
      }
      const { actionId, targets } = action.payload;
      const sourceUnit = state.units[state.currentTurn.unitId];
      const sourceAction = sourceUnit.actions[actionId];
      const slotIdToUnit = getSlotIdToUnitMap(state.units);
      switch (sourceAction.type) {
        case 'basic-action': {
          targets.forEach((slot) => {
            sourceAction.props.forEach((prop) => {
              const targetId = slotIdToUnit[slot.name][slot.id].id;
              if (prop.stat === 'hp' && prop.mod < 0) {
                state.units[targetId].stats[prop.stat].current +=
                  prop.mod + sourceUnit.stats.shield.current;
              } else {
                state.units[targetId].stats[prop.stat].current += prop.mod;
              }
            });
          });
        }
      }
      mutableEndTurn(state);
    },
  },
});
