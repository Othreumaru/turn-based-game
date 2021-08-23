import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { Stages, stageSwitchSlice } from '../features/stage-switch';
import { TeamStageComponent } from './team-stage';
import { BattleStageComponent } from './battle-stage';

import { LoadResourcesStageComponent } from './load-resources-stage';
import { TeamStageResult } from './types';
import { battleSlice } from '../features/battle';
import { BoardStageComponent } from './board-stage';

interface Props {}

const StageSwitcherComponent: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const stage = useSelector<RootState, Stages>((state) => state.stageSwitch.stage);

  return (
    <Container>
      {stage === 'load-resources-stage' && (
        <LoadResourcesStageComponent
          onDone={() => {
            dispatch(stageSwitchSlice.actions.setStage('board-stage'));
          }}
        />
      )}
      {stage === 'team-stage' && (
        <TeamStageComponent
          onDone={(result: TeamStageResult) => {
            dispatch(battleSlice.actions.startGame(result.units));
            dispatch(stageSwitchSlice.actions.setStage('battle-stage'));
          }}
        />
      )}
      {stage === 'battle-stage' && (
        <BattleStageComponent
          onDone={() => {
            dispatch(stageSwitchSlice.actions.setStage('team-stage'));
          }}
        />
      )}
      {stage === 'board-stage' && (
        <BoardStageComponent
          onDone={() => {
            dispatch(stageSwitchSlice.actions.setStage('team-stage'));
          }}
        />
      )}
    </Container>
  );
};

export const StageSwitcher = StageSwitcherComponent;
