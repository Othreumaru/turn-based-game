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
  width: number;
  height: number;
}

const CURRENT_UNIT_Y_OFFSET = 10;
const QUEUE_UNIT_SIZE = 80;
const QUEUE_UNIT_OFFSET = 10;

const TEAM_SLOT_X_OFFSET = 10;
const PLAYER_TEAM_ANCHOR = new PIXI.Point(0, 0.5);
const ENEMY_TEAM_ANCHOR = new PIXI.Point(1, 0.5);

const StageComponent: React.FC<Props> = ({ app, width: viewportWidth, height: viewportHeight }) => {
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const [state] = useState<Game>(getInitialState());

  return (
    <Stage app={app}>
      <UnitComponent
        x={viewportCenterX}
        y={CURRENT_UNIT_Y_OFFSET}
        height={QUEUE_UNIT_SIZE}
        width={QUEUE_UNIT_SIZE}
        unit={state.units[state.currentTurnUnitId]}
      />
      {state.upcomingTurnUnitIds
        .map((unitId) => state.units[unitId])
        .map((unit, index) => (
          <UnitComponent
            x={viewportCenterX + 20 + (index + 1) * (QUEUE_UNIT_SIZE + QUEUE_UNIT_OFFSET)}
            y={CURRENT_UNIT_Y_OFFSET}
            height={QUEUE_UNIT_SIZE}
            width={QUEUE_UNIT_SIZE}
            unit={unit}
          />
        ))}
      <TeamContainer
        x={TEAM_SLOT_X_OFFSET}
        y={viewportCenterY}
        units={Object.values(state.units).filter((unit) => unit.team === 'player')}
        team={state.playerTeam}
        orientation={'right'}
        anchor={PLAYER_TEAM_ANCHOR}
      />
      <TeamContainer
        x={viewportWidth - 10}
        y={viewportCenterY}
        units={Object.values(state.units).filter((unit) => unit.team === 'enemy')}
        team={state.enemyTeam}
        orientation={'left'}
        anchor={ENEMY_TEAM_ANCHOR}
      />
    </Stage>
  );
};

export const MainStage = hot(StageComponent);
