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
import { UnitMap } from '../components/types';

interface Props {}

const StageSwitcherComponent: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const stage = useSelector<RootState, Stages>((state) => state.stageSwitch.stage);
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);

  useEffect(() => {
    if (!Object.keys(units).length) {
      dispatch(
        unitsSlice.actions.spawnUnits([
          createWarrior('player', 1, 0),
          createWarrior('player', 1, 1),
          createWarrior('player', 1, 2),
          createHealer('player', 0, 1),
          createOrc('enemy', 1, 1),
          createOrc('enemy', 1, 0),
          createGoblin('enemy', 0, 1),
        ])
      );
    }
  }, [units, dispatch]);

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
