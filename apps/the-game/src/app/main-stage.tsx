import * as React from 'react';
import { Container, Stage, Text } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import * as PIXI from 'pixi.js';
import { UnitMap } from '../components/types';
import { SLOTS, unitIsDead } from './game-logic';
import { useEffect, useState } from 'react';
import { TeamContainer } from '../components/team-container/team-container';
import { UnitComponent } from '../components/unit-component';
import { Rect, TweenAnimation } from '../components/rect';
import { Button } from '../components/button/button';
import { TweenManager } from '@zalgoforge/the-tween';
import { useDispatch, useSelector } from 'react-redux';
import { unitsSlice } from '../features/units';
import { createGoblin, createHealer, createOrc, createWarrior } from './create-units';
import { RootState } from './root-reducer';
import { performUnitAction } from './game-actions';

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
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const currentTurnUnitId = useSelector<RootState, string>((state) => state.game.currentTurnUnitId);
  const upcomingTurnUnitIds = useSelector<RootState, string[]>(
    (state) => state.game.upcomingTurnUnitIds
  );

  const dispatch = useDispatch();

  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  useEffect(() => {
    dispatch(
      unitsSlice.actions.spawnUnits([
        createWarrior('slot10'),
        createWarrior('slot11'),
        createWarrior('slot12'),
        createHealer('slot01'),
        createOrc('slot11'),
        createGoblin('slot01'),
      ])
    );
  }, []);

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };
  const onMouseOut = () => {
    setMouseOverUnitId(undefined);
  };
  const unitClick = (unitId: string) => () => {
    const sourceUnit = units[currentTurnUnitId];
    performUnitAction(
      sourceUnit,
      (dmgAmount, isCrit) => {
        dispatch(
          unitsSlice.actions.dmgUnit({
            sourceUnitId: sourceUnit.id,
            targets: [
              {
                unitId,
                dmgAmount,
                isCrit,
              },
            ],
          })
        );
      },
      (healAmount, isCrit) => {
        dispatch(
          unitsSlice.actions.healUnit({
            sourceUnitId: sourceUnit.id,
            targets: [
              {
                unitId,
                healAmount,
                isCrit,
              },
            ],
          })
        );
      },
      () => {
        dispatch(
          unitsSlice.actions.missUnit({
            sourceUnitId: sourceUnit.id,
            targetUnitIds: [unitId],
          })
        );
      }
    );
  };

  return (
    <Stage app={app}>
      <Container
        x={viewportCenterX}
        y={CURRENT_UNIT_Y_OFFSET}
        interactive={true}
        mouseover={onMouseOver(currentTurnUnitId)}
        mouseout={onMouseOut}
      >
        <UnitComponent
          height={QUEUE_UNIT_SIZE}
          width={QUEUE_UNIT_SIZE}
          unit={units[currentTurnUnitId]}
        />
        <Rect
          width={QUEUE_UNIT_SIZE}
          height={QUEUE_UNIT_SIZE}
          lineColor={MOUSE_OVER_LINE_COLOR}
          lineWidth={3}
          alpha={mouseOverUnitId === currentTurnUnitId ? 1 : 0}
        />
      </Container>

      {upcomingTurnUnitIds
        .map((unitId) => units[unitId])
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
              const unit = Object.values(units)
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
                    {currentTurnUnitId === unit.id && (
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
          dispatch(unitsSlice.actions.endTurn());
        }}
      />
    </Stage>
  );
};

export const MainStage = hot(StageComponent);
