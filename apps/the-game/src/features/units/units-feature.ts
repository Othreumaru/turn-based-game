import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecuteActionArgs, Game, MissEffect, Turn, Unit } from './types';
import * as R from 'ramda';
import { MoveUnitToEmptySlotAction, SwapAction } from './types';
import { getSlotIdToUnitMap, unitIsEnemy, unitIsPlayer } from './selectors';
import { getRandomName, listToMapReducer } from '../../utils';
import { createHealer, createRat, createWarrior } from './create-units';

let initialState: Game = {
  turnCount: 0,
  goldCount: 100,
  teamSize: 1,
  costs: {
    teamSlot: 10,
  },
  units: [
    createWarrior(getRandomName(), 'bench', 0, 0),
    createWarrior(getRandomName(), 'bench', 1, 0),
    createWarrior(getRandomName(), 'bench', 2, 0),
    createHealer(getRandomName(), 'bench', 3, 0),
    createWarrior(getRandomName(), 'bench', 4, 0),
    createRat('A Rat', 'enemy', 1, 1),
    createRat('A Rat', 'enemy', 1, 0),
    createRat('A Rat', 'enemy', 0, 1),
  ].reduce(listToMapReducer, {}),
  upcomingTurns: [],
  currentTurn: undefined,
  completedTurns: [],
};

const unitToTurn = (unit: Unit): Turn => ({ unitId: unit.id, selectedActionIndex: 0 });

const sortUnits = (units: Unit[]): Unit[] => {
  return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};

const mutableEndTurn = (state: Game) => {
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

export const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    spawnUnits: (state, action: PayloadAction<Unit[]>) => {
      const units = action.payload;

      units.forEach((unit) => {
        state.units[unit.id] = unit;
      });
    },
    startGame: (state, _: PayloadAction<void>) => {
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
    missUnit: (state, action: PayloadAction<MissEffect>) => {
      state.units[action.payload.sourceUnitId].stats.attackCount.current += 1;
      action.payload.targetUnitIds.forEach((unitId) => {
        state.units[unitId].stats.missCount.current += 1;
      });
      mutableEndTurn(state);
    },
    swapUnits: (state, action: PayloadAction<SwapAction>) => {
      const sourceSlot = state.units[action.payload.sourceUnitId].slot;
      state.units[action.payload.sourceUnitId].slot = state.units[action.payload.targetUnitId].slot;
      state.units[action.payload.targetUnitId].slot = sourceSlot;
    },
    moveUnitToEmptySlot: (state, action: PayloadAction<MoveUnitToEmptySlotAction>) => {
      state.units[action.payload.unitId].slot = action.payload.slot;
    },
    buyTeamSlot: (state, action: PayloadAction<void>) => {
      if (state.goldCount >= state.costs.teamSlot) {
        state.goldCount -= state.costs.teamSlot;
        state.costs.teamSlot *= 10;
        state.teamSize += 1;
      }
    },
  },
});
