import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { Stages, stageSwitchSlice } from '../features/stage-switch';
import { TeamStageComponent } from './team-stage';
import { BattleStageComponent } from './battle-stage';
import { UnitMap, unitsSlice } from '../features/units';
import { createGoblin, createHealer, createOrc, createWarrior } from '../features/units';
import { useEffect } from 'react';
import { getRandomName } from '../utils/utils';

interface Props {}

const StageSwitcherComponent: React.FC<Props> = ({}) => {
  const dispatch = useDispatch();
  const stage = useSelector<RootState, Stages>((state) => state.stageSwitch.stage);
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);

  useEffect(() => {
    if (!Object.keys(units).length) {
      dispatch(
        unitsSlice.actions.spawnUnits([
          createWarrior(`${getRandomName()}, melee`, 'player', 1, 0),
          createWarrior(`${getRandomName()}, melee`, 'player', 1, 1),
          createWarrior(`${getRandomName()}, melee`, 'player', 1, 2),
          createHealer(`${getRandomName()}, heal`, 'player', 0, 1),
          createOrc('Orc1', 'enemy', 1, 1),
          createOrc('Orc2', 'enemy', 1, 0),
          createGoblin('Goblin', 'enemy', 0, 1),
          createWarrior(`${getRandomName()}, melee`, 'bench', 1, 0),
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
      {stage === 'battle-stage' && (
        <BattleStageComponent
          onDone={() => {
            dispatch(stageSwitchSlice.actions.setStage('team-stage'));
          }}
        />
      )}
    </Container>
  );
};

export const StageSwitcher = StageSwitcherComponent;
