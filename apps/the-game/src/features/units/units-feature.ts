import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecuteActionArgs, Game, MissEffect, Unit } from './types';
import * as R from 'ramda';
import { MoveUnitToEmptySlotAction, SwapAction } from './types';
import { getSlotIdToUnitMap, unitIsEnemy, unitIsPlayer } from './selectors';
import { getRandomName, listToMapReducer } from '../../utils';
import { createGoblin, createHealer, createOrc, createWarrior } from './create-units';

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
    createOrc(getRandomName(), 'enemy', 1, 1),
    createOrc(getRandomName(), 'enemy', 1, 0),
    createGoblin(getRandomName(), 'enemy', 0, 1),
  ].reduce(listToMapReducer, {}),
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
  state.turnCount += 1;
  state.units[current].buffs = [];
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
      const units = Object.values(state.units).filter((u) => unitIsPlayer(u) || unitIsEnemy(u));
      const unitIds = sortUnits([
        ...state.upcomingTurnUnitIds.map((unitId) => state.units[unitId]),
        ...units,
      ]).map((u) => u.id);

      state.upcomingTurnUnitIds = state.currentTurnUnitId === '' ? unitIds.slice(1) : unitIds;
      state.currentTurnUnitId =
        state.currentTurnUnitId === '' ? unitIds[0] : state.currentTurnUnitId;
    },
    endTurn: (state, _: PayloadAction<void>) => {
      mutableEndTurn(state);
    },
    executeCurrentUnitAction: (state, action: PayloadAction<ExecuteActionArgs>) => {
      const { actionId, targets } = action.payload;
      const sourceUnit = state.units[state.currentTurnUnitId];
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
