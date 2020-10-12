import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetBenchUnit, TeamChooser } from './team-chooser-types';
import { createHealer, createWarrior } from '../../app/create-units';

let initialState: TeamChooser = {
  unitsOnBench: {
    slot0: undefined,
    slot1: undefined,
    slot2: createWarrior('slot00'),
    slot3: createHealer('slot00'),
    slot4: undefined,
    slot5: createWarrior('slot00'),
  },
};

export const teamChooserSlice = createSlice({
  name: 'teamChooser',
  initialState,
  reducers: {
    setBenchUnit: (state, action: PayloadAction<SetBenchUnit>) => {
      state.unitsOnBench[action.payload.slot] = action.payload.unit;
    },
  },
});
