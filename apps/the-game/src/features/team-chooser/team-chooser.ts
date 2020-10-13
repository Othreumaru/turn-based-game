import { createSlice } from '@reduxjs/toolkit';
import { TeamChooser } from './team-chooser-types';

let initialState: TeamChooser = {
  unitsOnBench: {},
};

export const teamChooserSlice = createSlice({
  name: 'teamChooser',
  initialState,
  reducers: {},
});
