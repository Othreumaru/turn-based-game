import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { UnitComponent, UnitDetails } from '../components/unit-component';
import { Rect } from '../components/rect';
import { Button } from '../components/button/button';
import { TweenAnimation } from '@zalgoforge/the-tween';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActionResult,
  getAlivePlayerUnits,
  getLayoutProjection,
  performUnitAction,
  SlotPointer,
  unitIsDead,
  UnitMap,
  unitsSlice,
} from '../features/units';
import { RootState } from './root-reducer';
import { Animable } from '../components/animable';
import { AppContext } from './app-context';
import { getUnitsInAttackRange } from '../features/units';
import { LEFT_X_CENTER_Y_ANCHOR, RIGHT_X_CENTER_Y_ANCHOR } from '../utils';

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

const executeAction = (
  dispatch: any,
  actionResult: ActionResult,
  sourceId: string,
  targetIds: string[]
) => {
  switch (actionResult.type) {
    case 'buff-action-result': {
      dispatch(
        unitsSlice.actions.buffUnit({
          sourceUnitId: sourceId,
          buffs: actionResult.buffs,
        })
      );
      break;
    }
    case 'attack-action-result': {
      dispatch(
        unitsSlice.actions.dmgUnit({
          sourceUnitId: sourceId,
          threat: actionResult.threat,
          targets: targetIds.map((targetId) => ({
            unitId: targetId,
            dmgAmount: actionResult.dmgAmount,
            isCrit: actionResult.isCrit,
          })),
        })
      );
      break;
    }
    case 'heal-action-result': {
      dispatch(
        unitsSlice.actions.healUnit({
          sourceUnitId: sourceId,
          threat: actionResult.threat,
          targets: [
            {
              unitId: sourceId,
              healAmount: actionResult.healAmount,
              isCrit: actionResult.isCrit,
            },
          ],
        })
      );
      break;
    }
    case 'miss-action-result': {
      dispatch(
        unitsSlice.actions.missUnit({
          sourceUnitId: sourceId,
          targetUnitIds: targetIds,
        })
      );
    }
  }
};

export const BattleStageComponent: React.FC<Props> = ({ onDone }) => {
  const { width: viewportWidth, height: viewportHeight, tweenManager } = React.useContext(
    AppContext
  );
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();
  const [mouseOverActionId, setMouseOverActionId] = useState<string>();
  const [selectedActionId, setSelectedActionId] = useState<string>();
  const prevTurnUnitId = useRef<string>();

  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const turnCount = useSelector<RootState, number>((state) => state.game.turnCount);
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const currentTurnUnitId = useSelector<RootState, string>((state) => state.game.currentTurnUnitId);
  const upcomingTurnUnitIds = useSelector<RootState, string[]>(
    (state) => state.game.upcomingTurnUnitIds
  );
  const unitsInAttackingRange =
    currentTurnUnitId !== '' && selectedActionId
      ? getUnitsInAttackRange(units, currentTurnUnitId, selectedActionId)
      : [];

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentTurnUnitId !== prevTurnUnitId.current && units[currentTurnUnitId]) {
      setSelectedActionId(Object.values(units[currentTurnUnitId].actions)[0].id);
    }
  }, [units, currentTurnUnitId]);

  useEffect(() => {
    prevTurnUnitId.current = currentTurnUnitId;
  });

  useEffect(() => {
    if (turnCount === 0) {
      dispatch(unitsSlice.actions.startGame());
    }
  }, [dispatch, turnCount]);

  useEffect(() => {
    if (getAlivePlayerUnits(units).length === 0) {
      onDone();
    }
  }, [units]);

  useEffect(() => {
    if (
      selectedActionId &&
      units[currentTurnUnitId] &&
      units[currentTurnUnitId].slot.name === 'enemy'
    ) {
      const actionId = Object.values(units[currentTurnUnitId].actions)[0].id;
      if (!actionId) {
        return;
      }
      const targetSlots = getUnitsInAttackRange(units, currentTurnUnitId, actionId);
      if (!targetSlots.length) {
        return;
      }
      const result = performUnitAction(units[currentTurnUnitId], actionId);
      const targetUnit = Object.values(units)
        .filter((unit) => targetSlots.find((slot) => unit.slot.id === slot.id) !== undefined)
        .sort((u1, u2) => u1.stats.threat.current - u2.stats.threat.current)[0];
      setTimeout(() => {
        executeAction(dispatch, result, currentTurnUnitId, [targetUnit.id]);
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
    if (
      !selectedActionId ||
      units[currentTurnUnitId].slot.name === 'enemy' ||
      unitIsDead(units[currentTurnUnitId])
    ) {
      return;
    }
    const sourceUnit = units[currentTurnUnitId];
    const result = performUnitAction(sourceUnit, selectedActionId);
    executeAction(dispatch, result, currentTurnUnitId, [unitId]);
  };

  const onMouseOverAction = (actionId: string) => () => {
    setMouseOverActionId(actionId);
  };
  const onMouseOutAction = () => {
    setMouseOverActionId(undefined);
  };
  const onClickAction = (actionId: string) => () => {
    setSelectedActionId(actionId);
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
              interactive={true}
              mouseover={onMouseOverAction(action.id)}
              mouseout={onMouseOutAction}
              click={onClickAction(action.id)}
            >
              <Rect width={200} height={200} fillColor={0x00ff00} />
              <Text
                text={action.name}
                style={{
                  fontSize: 16,
                  align: 'center',
                  fontWeight: 'bold',
                  wordWrap: true,
                  wordWrapWidth: 200,
                }}
              />
              <Text
                text={action.description}
                y={30}
                style={{
                  fontSize: 16,
                  align: 'center',
                  fontWeight: 'bold',
                  wordWrap: true,
                  wordWrapWidth: 200,
                }}
              />
              {selectedActionId === action.id && (
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
                lineWidth={3}
                alpha={mouseOverActionId === action.id ? 1 : 0}
              />
            </Container>
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
    </Container>
  );
};
