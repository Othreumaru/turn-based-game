import * as React from 'react';
import { Container, Stage, Text } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import * as PIXI from 'pixi.js';
import { DmgEffect, Effect } from '../types';
import { attackUnit, getGame, getInitialState, SLOTS, unitIsDead } from './game-logic';
import { useState } from 'react';
import { TeamContainer } from '../team-container/team-container';
import { UnitComponent } from '../unit-component';
import { Rect, TweenAnimation } from '../rect';
import { Button } from '../button/button';
import * as R from 'ramda';
import { EffectContainer } from '../effect-container';
import { TweenManager } from '@zalgoforge/the-tween';

interface Props {
  app: PIXI.Application;
  tweenManager: TweenManager;
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
const MIDDLE_ANCHOR = new PIXI.Point(0.5, 0.5);

const SELECTED_UNIT_BORDER_ANIMATION: TweenAnimation = {
  duration: 750,
  loop: true,
  pingPong: true,
  keyframes: {
    from: {
      lineColor: 0x72bcd4,
    },
    to: {
      lineColor: 0xc1e1ec,
    },
  },
};

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

const StageComponent: React.FC<Props> = ({
  app,
  tweenManager,
  width: viewportWidth,
  height: viewportHeight,
}) => {
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const [state, setState] = useState<Effect[]>(getInitialState());
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  const gameState = getGame(state);

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };
  const onMouseOut = () => {
    setMouseOverUnitId(undefined);
  };
  const unitClick = (unitId: string) => () => {
    setState(attackUnit(gameState)(gameState.currentTurnUnitId)(unitId));
  };

  return (
    <Stage app={app}>
      <Container
        x={viewportCenterX}
        y={CURRENT_UNIT_Y_OFFSET}
        interactive={true}
        mouseover={onMouseOver(gameState.currentTurnUnitId)}
        mouseout={onMouseOut}
      >
        <UnitComponent
          height={QUEUE_UNIT_SIZE}
          width={QUEUE_UNIT_SIZE}
          unit={gameState.units[gameState.currentTurnUnitId]}
        />
        <Rect
          width={QUEUE_UNIT_SIZE}
          height={QUEUE_UNIT_SIZE}
          lineColor={MOUSE_OVER_LINE_COLOR}
          lineWidth={3}
          alpha={mouseOverUnitId === gameState.currentTurnUnitId ? 1 : 0}
        />
      </Container>

      {gameState.upcomingTurnUnitIds
        .map((unitId) => gameState.units[unitId])
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
            slots={SLOTS}
            orientation={orientation}
            anchor={anchor}
          >
            {({ slotId, x, y, width, height }) => {
              const unit = Object.values(gameState.units)
                .filter((u) => u.team === team)
                .find((u) => u.slotId === slotId);
              return unit ? (
                unitIsDead(unit) ? (
                  <Container key={slotId} x={x} y={y} width={width} height={height}>
                    <Rect width={width} height={height} fillColor={0xeeeeee} />
                    <Container x={width / 2} y={height / 2}>
                      <Text text={'DEAD'} anchor={MIDDLE_ANCHOR} />
                    </Container>
                  </Container>
                ) : (
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
                    {gameState.currentTurnUnitId === unit.id && (
                      <Rect
                        width={width}
                        height={height}
                        lineWidth={6}
                        tweenManager={tweenManager}
                        animation={SELECTED_UNIT_BORDER_ANIMATION}
                      />
                    )}
                    <Rect
                      width={width}
                      height={height}
                      lineColor={MOUSE_OVER_LINE_COLOR}
                      lineWidth={3}
                      alpha={mouseOverUnitId === unit.id ? 1 : 0}
                    />

                    <EffectContainer
                      tweenManager={tweenManager}
                      effects={state}
                      initialPropValues={{ alpha: 0 }}
                      triggerOn={(e) =>
                        e.type === 'miss-effect' && e.targetUnitIds.includes(unit.id)
                      }
                      onEnter={[
                        { prop: 'alpha', toValue: 1, time: 500 },
                        { prop: 'alpha', toValue: 1, time: 500 },
                        { prop: 'alpha', toValue: 0, time: 500 },
                      ]}
                    >
                      {() => (
                        <>
                          <Rect width={width} height={height} fillColor={0xffffff} alpha={0.4} />
                          <Container x={width / 2} y={height / 2}>
                            <Text text={'MISS'} anchor={MIDDLE_ANCHOR} />
                          </Container>
                        </>
                      )}
                    </EffectContainer>
                    <EffectContainer
                      tweenManager={tweenManager}
                      effects={state}
                      initialPropValues={{ alpha: 0 }}
                      triggerOn={(e) =>
                        e.type === 'dmg-effect' &&
                        e.targets.find((t) => t.unitId === unit.id) !== undefined
                      }
                      onEnter={[
                        { prop: 'alpha', toValue: 1, time: 200 },
                        { prop: 'alpha', toValue: 1, time: 700 },
                        { prop: 'alpha', toValue: 0, time: 200 },
                      ]}
                    >
                      {(effect) => {
                        const e = (effect as DmgEffect).targets.find((t) => t.unitId === unit.id);
                        return (
                          <>
                            <Rect width={width} height={height} fillColor={0xff0000} alpha={0.4} />
                            <Container x={width / 2} y={height / 2}>
                              <Text
                                text={e ? `${e.dmgAmount}` : '?'}
                                style={{ fill: 0xffffff, fontSize: e ? (e.isCrit ? 50 : 24) : 10 }}
                                anchor={MIDDLE_ANCHOR}
                              />
                            </Container>
                          </>
                        );
                      }}
                    </EffectContainer>
                  </Container>
                )
              ) : null;
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
          setState(R.append({ type: 'end-turn-effect' }));
        }}
      />
    </Stage>
  );
};

export const MainStage = hot(StageComponent);