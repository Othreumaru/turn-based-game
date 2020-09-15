import * as React from 'react';
import { Stage } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import * as PIXI from 'pixi.js';
import { Game } from '../types';
import { getInitialState } from './game-logic';
import { useState } from 'react';
import { TeamContainer } from '../team-container/team-container';

interface Props {
  app: PIXI.Application;
}

const TEAM_SLOT_X_OFFSET = 10;
const TEAM_SLOT_Y_OFFSET = 150;
const ENEMY_SLOT_X_OFFSET = 700;
const ENEMY_SLOT_Y_OFFSET = 150;

const StageComponent: React.FC<Props> = ({ app }) => {
  const [state] = useState<Game>(getInitialState());

  return (
    <Stage app={app}>
      <TeamContainer
        x={TEAM_SLOT_X_OFFSET}
        y={TEAM_SLOT_Y_OFFSET}
        team={state.playerTeam}
        orientation={'right'}
      />
      <TeamContainer
        x={ENEMY_SLOT_X_OFFSET}
        y={ENEMY_SLOT_Y_OFFSET}
        team={state.enemyTeam}
        orientation={'left'}
      />
    </Stage>
  );
};

export const MainStage = hot(StageComponent);
