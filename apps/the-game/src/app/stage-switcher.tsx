import * as React from 'react';
import * as PIXI from 'pixi.js';
import { Container } from 'react-pixi-fiber';
import { TweenManager } from '@zalgoforge/the-tween';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { Stages, stageSwitchSlice } from '../features/stage-switch';
import { TeamStageComponent } from './team-stage';
import { BattleStageComponent } from './main-stage';

interface Props {
  app: PIXI.Application;
  tweenManager: TweenManager;
  width: number;
  height: number;
}

const StageSwitcherComponent: React.FC<Props> = ({
  app,
  tweenManager,
  width: viewportWidth,
  height: viewportHeight,
}) => {
  const dispatch = useDispatch();
  const stage = useSelector<RootState, Stages>((state) => state.stageSwitch.stage);
  return (
    <Container>
      {stage === 'team-stage' && (
        <TeamStageComponent
          onDone={() => {
            dispatch(stageSwitchSlice.actions.setStage('battle-stage'));
          }}
        />
      )}
      {stage === 'battle-stage' && (
        <BattleStageComponent
          height={viewportHeight}
          width={viewportWidth}
          tweenManager={tweenManager}
          dispatch={dispatch}
        />
      )}
    </Container>
  );
};

export const StageSwitcher = StageSwitcherComponent;
