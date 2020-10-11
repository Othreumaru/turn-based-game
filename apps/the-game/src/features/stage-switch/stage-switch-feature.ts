import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stages, StageSwitch } from './stage-switch-types';

let initialState: StageSwitch = {
  stage: 'team-stage',
};

export const stageSwitchSlice = createSlice({
  name: 'stageSwitch',
  initialState,
  reducers: {
    setStage: (state, action: PayloadAction<Stages>) => {
      state.stage = action.payload;
      return state;
    },
  },
});
