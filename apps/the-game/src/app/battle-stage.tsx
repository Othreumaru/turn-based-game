import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { UnitComponent, UnitDetails } from '../components/unit-component';
import { Rect } from '../components/rect';
import { Button } from '../components/button/button';
import { TweenAnimation } from '@zalgoforge/the-tween';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAlivePlayerUnits,
  getLayoutProjection,
  unitIsEnemy,
  slotEquals,
  SlotPointer,
  Unit,
  unitIsDead,
  UnitMap,
  unitsSlice,
} from '../features/units';
import { RootState } from './root-reducer';
import { Animable } from '../components/animable';
import { AppContext } from './app-context';
import { getUnitsInAttackRange } from '../features/units';
import { LEFT_X_CENTER_Y_ANCHOR, RIGHT_X_CENTER_Y_ANCHOR } from '../utils';
import { CardComponent } from '../components/card-component';

interface Props {
  onDone: () => void;
}

interface RenderData {
  slot: SlotPointer;
  x: number;
  y: number;
  width: number;
  height: number;
}

type RenderCallback = (data: RenderData) => any;

const CURRENT_UNIT_Y_OFFSET = 10;
const QUEUE_UNIT_SIZE = 100;
const QUEUE_UNIT_OFFSET = 10;

const TEAM_SLOT_X_OFFSET = 10;
const MOUSE_OVER_LINE_COLOR = 0xff0000;

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

const TARGET_UNIT_BORDER_ANIMATION: TweenAnimation = {
  duration: 750,
  loop: true,
  pingPong: true,
  keyframes: {
    from: {
      lineColor: 0xff0000,
    },
    to: {
      lineColor: 0xffdddd,
    },
  },
};

const TAKE_DMG_ANIMATION: TweenAnimation = {
  duration: 300,
  loop: false,
  pingPong: true,
  keyframes: {
    from: {
      x: 0,
    },
    to: {
      x: 40,
    },
  },
};

const playerProjection = getLayoutProjection({
  name: 'player',
  columns: 2,
  rows: 3,
  anchor: LEFT_X_CENTER_Y_ANCHOR,
});

const enemyProjection = getLayoutProjection({
  name: 'enemy',
  columns: 2,
  rows: 3,
  anchor: RIGHT_X_CENTER_Y_ANCHOR,
  mirrorX: true,
});

export const BattleStageComponent: React.FC<Props> = ({ onDone }) => {
  const { width: viewportWidth, height: viewportHeight, tweenManager } = React.useContext(
    AppContext
  );
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();
  const [mouseOverActionId, setMouseOverActionId] = useState<string>();
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0);
  const prevTurnUnitId = useRef<string>();

  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const currentTurnUnitId = useSelector<RootState, string>((state) => state.game.currentTurnUnitId);
  const upcomingTurnUnitIds = useSelector<RootState, string[]>(
    (state) => state.game.upcomingTurnUnitIds
  );
  const unitsInAttackingRange =
    currentTurnUnitId !== '' && Object.values(units[currentTurnUnitId].actions)[selectedActionIndex]
      ? getUnitsInAttackRange(
          units,
          currentTurnUnitId,
          Object.values(units[currentTurnUnitId].actions)[selectedActionIndex].id
        )
      : [];

  const dispatch = useDispatch();

  useEffect(() => {
    prevTurnUnitId.current = currentTurnUnitId;
  });

  if (getAlivePlayerUnits(units).length === 0) {
    onDone();
  }

  useEffect(() => {
    if (
      selectedActionIndex &&
      units[currentTurnUnitId] &&
      units[currentTurnUnitId].slot.name === 'enemy'
    ) {
      const actionId = Object.values(units[currentTurnUnitId].actions)[0].id;
      if (!actionId) {
        return;
      }
      const targetSlots = getUnitsInAttackRange(units, currentTurnUnitId, actionId);
      console.log('attacking', targetSlots);
      if (!targetSlots.length) {
        return;
      }
      const listOfUnits = Object.values(units);
      const targetUnits = targetSlots
        .map((slot) => listOfUnits.find((unit) => slotEquals(unit.slot)(slot)))
        .filter((unit): unit is Unit => unit !== undefined)
        .sort((u1, u2) => u1.stats.threat.current - u2.stats.threat.current);
      const targetUnit = targetUnits[0];
      setTimeout(() => {
        dispatch(
          unitsSlice.actions.executeCurrentUnitAction({
            actionId: Object.values(units[currentTurnUnitId].actions)[0].id,
            targets: [targetUnit].map((unit) => unit.slot),
          })
        );
      }, 1000);
    }
  }, [units, currentTurnUnitId]);

  const onMouseOverUnit = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };
  const onMouseOutUnit = () => {
    setMouseOverUnitId(undefined);
  };
  const onClickUnit = (unitId: string) => () => {
    if (unitIsEnemy(units[currentTurnUnitId]) || unitIsDead(units[currentTurnUnitId])) {
      return;
    }
    const selectedActionId = Object.values(units[currentTurnUnitId].actions)[selectedActionIndex]
      .id;
    dispatch(
      unitsSlice.actions.executeCurrentUnitAction({
        actionId: selectedActionId,
        targets: [units[unitId].slot],
      })
    );
    setSelectedActionIndex(0);
  };

  const onMouseOverAction = (actionId: string) => () => {
    setMouseOverActionId(actionId);
  };
  const onMouseOutAction = () => {
    setMouseOverActionId(undefined);
  };
  const onClickAction = (actionIndex: number) => () => {
    setSelectedActionIndex(actionIndex);
  };

  const renderSlot: RenderCallback = ({ x, y, width, height, slot }) => {
    return (
      <Container key={slot.id} x={x} y={y}>
        <Rect width={width} height={height} fillColor={0x00ff00} />
      </Container>
    );
  };

  const renderUnit: (team: string) => RenderCallback = (team: string) => ({
    x,
    y,
    width,
    height,
    slot,
  }) => {
    const unit = Object.values(units)
      .filter((u) => u.slot.name === team)
      .find((u) => u.slot.id === slot.id);
    return unit ? (
      <Container
        key={slot.id}
        x={x}
        y={y}
        width={width}
        height={height}
        interactive={true}
        mouseover={onMouseOverUnit(unit.id)}
        mouseout={onMouseOutUnit}
        click={onClickUnit(unit.id)}
      >
        <Animable
          tweenManager={tweenManager}
          animationTrigger={unit.stats.hp.current + unit.stats.attackCount.current}
          width={width}
          height={height}
          animation={TAKE_DMG_ANIMATION}
        >
          <UnitComponent width={width} height={height} unit={unit} tweenManager={tweenManager} />
        </Animable>
        {currentTurnUnitId === unit.id && (
          <Animable
            width={width}
            height={height}
            lineWidth={6}
            tweenManager={tweenManager}
            animation={SELECTED_UNIT_BORDER_ANIMATION}
          />
        )}
        {unitsInAttackingRange.find((s) => s.id === unit.slot.id) &&
          unit.slot.name === unitsInAttackingRange[0].name && (
            <Animable
              width={width}
              height={height}
              lineWidth={6}
              tweenManager={tweenManager}
              animation={TARGET_UNIT_BORDER_ANIMATION}
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
    ) : null;
  };

  return (
    <Container>
      <Container
        x={viewportCenterX}
        y={CURRENT_UNIT_Y_OFFSET}
        interactive={true}
        mouseover={onMouseOverUnit(currentTurnUnitId)}
        mouseout={onMouseOutUnit}
      >
        {currentTurnUnitId !== '' && (
          <UnitComponent
            height={QUEUE_UNIT_SIZE}
            width={QUEUE_UNIT_SIZE}
            unit={units[currentTurnUnitId]}
            tweenManager={tweenManager}
          />
        )}
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
            mouseover={onMouseOverUnit(unit.id)}
            mouseout={onMouseOutUnit}
          >
            <UnitComponent
              tweenManager={tweenManager}
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
      <Container>
        {playerProjection.map(({ x, y, ...rest }) =>
          renderSlot({
            x: x + TEAM_SLOT_X_OFFSET,
            y: y + viewportCenterY,
            ...rest,
          })
        )}
        {enemyProjection.map(({ x, y, ...rest }) =>
          renderSlot({
            x: x + viewportWidth - TEAM_SLOT_X_OFFSET,
            y: y + viewportCenterY,
            ...rest,
          })
        )}
      </Container>
      <Container>
        {playerProjection.map(({ x, y, ...rest }) =>
          renderUnit('player')({
            x: x + TEAM_SLOT_X_OFFSET,
            y: y + viewportCenterY,
            ...rest,
          })
        )}
        {enemyProjection.map(({ x, y, ...rest }) =>
          renderUnit('enemy')({
            x: x + viewportWidth - TEAM_SLOT_X_OFFSET,
            y: y + viewportCenterY,
            ...rest,
          })
        )}
      </Container>
      {units[currentTurnUnitId] && <UnitDetails x={30} y={20} unit={units[currentTurnUnitId]} />}
      {mouseOverUnitId && units[mouseOverUnitId] && (
        <UnitDetails x={230} y={20} unit={units[mouseOverUnitId]} />
      )}
      {units[currentTurnUnitId] &&
        Object.values(units[currentTurnUnitId].actions).map((action, index) => {
          return (
            <Container
              key={action.id}
              x={700 + index * 220}
              y={700}
              width={200}
              height={200}
              interactive={true}
              mouseover={onMouseOverAction(action.id)}
              mouseout={onMouseOutAction}
              click={onClickAction(index)}
            >
              <Rect fillColor={0xffffff} width={200} height={200} />
              <CardComponent card={action} width={200} height={200} />
              {selectedActionIndex === index && (
                <Animable
                  width={200}
                  height={200}
                  lineWidth={6}
                  tweenManager={tweenManager}
                  animation={SELECTED_UNIT_BORDER_ANIMATION}
                />
              )}
              <Rect
                width={200}
                height={200}
                lineColor={MOUSE_OVER_LINE_COLOR}
                lineWidth={6}
                alpha={mouseOverActionId === action.id ? 1 : 0}
              />
            </Container>
          );
        })}
      <Button
        x={1150}
        y={700}
        type={'enabled'}
        width={120}
        height={30}
        onClick={() => {
          dispatch(unitsSlice.actions.endTurn());
        }}
      >
        <Text text={'Skip Turn'} />
      </Button>
    </Container>
  );
};
