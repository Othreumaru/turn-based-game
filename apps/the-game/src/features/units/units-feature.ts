import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Unit } from './types';
import { MoveUnitToEmptySlotAction, SwapAction } from './types';
import { getRandomName, listToMapReducer } from '../../utils';
import { createHealer, createRat, createWarrior } from './create-units';

let initialState: Game = {
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
