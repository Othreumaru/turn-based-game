import { combineReducers } from '@reduxjs/toolkit';
import { unitsSlice } from '../features/units';
import { stageSwitchSlice } from '../features/stage-switch';
import { teamChooserSlice } from '../features/team-chooser';

export const rootReducer = combineReducers({
  game: unitsSlice.reducer,
  stageSwitch: stageSwitchSlice.reducer,
  teamChooser: teamChooserSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
