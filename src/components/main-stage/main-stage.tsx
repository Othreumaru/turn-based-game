import * as React from 'react';
import { Stage } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import * as PIXI from 'pixi.js';
import { Game } from '../types';
import { getInitialState } from './game-logic';
import { useState } from 'react';
import { TeamContainer } from '../team-container/team-container';
import { UnitComponent } from '../unit-component';

interface Props {
  app: PIXI.Application;
}

const CURRENT_UNIT_X_OFFSET = 450;
const CURRENT_UNIT_Y_OFFSET = 10;
const QUEUE_UNIT_SIZE = 80;
const QUEUE_UNIT_OFFSET = 10;

const TEAM_SLOT_X_OFFSET = 10;
const TEAM_SLOT_Y_OFFSET = 150;
const ENEMY_SLOT_X_OFFSET = 700;
const ENEMY_SLOT_Y_OFFSET = 150;

const StageComponent: React.FC<Props> = ({ app }) => {
  const [state] = useState<Game>(getInitialState());

  return (
    <Stage app={app}>
      <UnitComponent
        x={CURRENT_UNIT_X_OFFSET}
        y={CURRENT_UNIT_Y_OFFSET}
        height={QUEUE_UNIT_SIZE}
        width={QUEUE_UNIT_SIZE}
        unit={state.units[state.currentTurnUnitId]}
      />
      {state.upcomingTurnUnitIds
        .map((unitId) => state.units[unitId])
        .map((unit, index) => (
          <UnitComponent
            x={CURRENT_UNIT_X_OFFSET + 20 + (index + 1) * (QUEUE_UNIT_SIZE + QUEUE_UNIT_OFFSET)}
            y={CURRENT_UNIT_Y_OFFSET}
            height={QUEUE_UNIT_SIZE}
            width={QUEUE_UNIT_SIZE}
            unit={unit}
          />
        ))}
      <TeamContainer
        x={TEAM_SLOT_X_OFFSET}
        y={TEAM_SLOT_Y_OFFSET}
        units={Object.values(state.units).filter((unit) => unit.team === 'player')}
        team={state.playerTeam}
        orientation={'right'}
      />
      <TeamContainer
        x={ENEMY_SLOT_X_OFFSET}
        y={ENEMY_SLOT_Y_OFFSET}
        units={Object.values(state.units).filter((unit) => unit.team === 'player')}
        team={state.enemyTeam}
        orientation={'left'}
      />
    </Stage>
  );
};

export const MainStage = hot(StageComponent);
