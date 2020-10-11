import { combineReducers } from '@reduxjs/toolkit';
import { unitsSlice } from '../features/units';
import { stageSwitchSlice } from '../features/stage-switch';

export const rootReducer = combineReducers({
  game: unitsSlice.reducer,
  stageSwitch: stageSwitchSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
