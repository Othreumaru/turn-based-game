import { combineReducers } from '@reduxjs/toolkit';
import { unitsSlice } from '../features/units';

export const rootReducer = combineReducers({
  game: unitsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
