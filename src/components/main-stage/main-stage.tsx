import * as React from 'react';
import { Container, Stage } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import * as PIXI from 'pixi.js';
import { Game } from '../types';
import { attackUnit, getInitialState, nextTurn } from './game-logic';
import { useState } from 'react';
import { TeamContainer } from '../team-container/team-container';
import { UnitComponent } from '../unit-component';
import { Rect } from '../rect';
import { Button } from '../button/button';

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
const MOUSE_OVER_LINE_COLOR = 0xff0000;

const getTeamConfig: (
  viewportWidth: number
) => {
  team: 'enemy' | 'player';
  x: number;
  orientation: 'left' | 'right';
  anchor: PIXI.Point;
}[] = (viewportWidth) => [
  { team: 'player', x: TEAM_SLOT_X_OFFSET, orientation: 'right', anchor: PLAYER_TEAM_ANCHOR },
  {
    team: 'enemy',
    x: viewportWidth - TEAM_SLOT_X_OFFSET,
    orientation: 'left',
    anchor: ENEMY_TEAM_ANCHOR,
  },
];

const StageComponent: React.FC<Props> = ({ app, width: viewportWidth, height: viewportHeight }) => {
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const [state, setState] = useState<Game>(getInitialState());
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };
  const onMouseOut = () => {
    setMouseOverUnitId(undefined);
  };
  const unitClick = (unitId: string) => () => {
    setState(attackUnit(state.currentTurnUnitId)(unitId));
  };

  return (
    <Stage app={app}>
      <Container
        x={viewportCenterX}
        y={CURRENT_UNIT_Y_OFFSET}
        interactive={true}
        mouseover={onMouseOver(state.currentTurnUnitId)}
        mouseout={onMouseOut}
      >
        <UnitComponent
          height={QUEUE_UNIT_SIZE}
          width={QUEUE_UNIT_SIZE}
          unit={state.units[state.currentTurnUnitId]}
        />
        <Rect
          width={QUEUE_UNIT_SIZE}
          height={QUEUE_UNIT_SIZE}
          lineColor={MOUSE_OVER_LINE_COLOR}
          lineWidth={3}
          alpha={mouseOverUnitId === state.currentTurnUnitId ? 1 : 0}
        />
      </Container>

      {state.upcomingTurnUnitIds
        .map((unitId) => state.units[unitId])
        .map((unit, index) => (
          <Container
            key={unit.id}
            x={viewportCenterX + 20 + (index + 1) * (QUEUE_UNIT_SIZE + QUEUE_UNIT_OFFSET)}
            y={CURRENT_UNIT_Y_OFFSET}
            interactive={true}
            mouseover={onMouseOver(unit.id)}
            mouseout={onMouseOut}
          >
            <UnitComponent
              key={unit.id}
              height={QUEUE_UNIT_SIZE}
              width={QUEUE_UNIT_SIZE}
              unit={unit}
            />
            <Rect
              width={QUEUE_UNIT_SIZE}
              height={QUEUE_UNIT_SIZE}
              lineColor={MOUSE_OVER_LINE_COLOR}
              lineWidth={3}
              alpha={mouseOverUnitId === unit.id ? 1 : 0}
            />
          </Container>
        ))}
      {getTeamConfig(viewportWidth).map(({ x, orientation, team, anchor }) => {
        return (
          <TeamContainer
            key={team}
            x={x}
            y={viewportCenterY}
            slots={state.slots}
            orientation={orientation}
            anchor={anchor}
          >
            {({ slotId, x, y, width, height }) => {
              const unit = Object.values(state.units)
                .filter((u) => u.team === team)
                .find((u) => u.slotId === slotId);
              return (
                unit && (
                  <Container
                    key={slotId}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    interactive={true}
                    mouseover={onMouseOver(unit.id)}
                    mouseout={onMouseOut}
                    click={unitClick(unit.id)}
                  >
                    <UnitComponent width={width} height={height} unit={unit} />
                    <Rect
                      width={width}
                      height={height}
                      lineColor={MOUSE_OVER_LINE_COLOR}
                      lineWidth={3}
                      alpha={mouseOverUnitId === unit.id ? 1 : 0}
                    />
                  </Container>
                )
              );
            }}
          </TeamContainer>
        );
      })}
      <Button
        x={800}
        y={900}
        width={120}
        height={30}
        label={'next-turn'}
        onClick={() => {
          setState(nextTurn);
        }}
      />
    </Stage>
  );
};

export const MainStage = hot(StageComponent);
