import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { Stages, stageSwitchSlice } from '../features/stage-switch';
import { TeamStageComponent } from './team-stage';
import { BattleStageComponent } from './battle-stage';
import { unitsSlice } from '../features/units';
import { createGoblin, createHealer, createOrc, createWarrior } from './create-units';
import { useEffect } from 'react';

interface Props {}

const StageSwitcherComponent: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const stage = useSelector<RootState, Stages>((state) => state.stageSwitch.stage);

  useEffect(() => {
    dispatch(
      unitsSlice.actions.spawnUnits([
        createWarrior('slot10'),
        createWarrior('slot11'),
        createWarrior('slot12'),
        createHealer('slot01'),
        createOrc('slot11'),
        createOrc('slot10'),
        createGoblin('slot01'),
      ])
    );
  }, []);

  return (
    <Container>
      {stage === 'team-stage' && (
        <TeamStageComponent
          onDone={() => {
            dispatch(stageSwitchSlice.actions.setStage('battle-stage'));
          }}
        />
      )}
      {stage === 'battle-stage' && <BattleStageComponent />}
    </Container>
  );
};

export const StageSwitcher = StageSwitcherComponent;
