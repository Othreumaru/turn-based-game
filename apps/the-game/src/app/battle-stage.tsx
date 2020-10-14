import * as React from 'react';
import { useEffect, useState } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { Stat, UnitActions, UnitMap } from '../components/types';
import { unitIsDead } from './game-logic';
import { RenderCallback, TeamContainer } from '../components/team-container';
import { UnitComponent } from '../components/unit-component';
import { Rect } from '../components/rect';
import { Button } from '../components/button/button';
import { TweenAnimation } from '@zalgoforge/the-tween';
import { useDispatch, useSelector } from 'react-redux';
import { getAlivePlayerUnits, unitsSlice } from '../features/units';
import { RootState } from './root-reducer';
import { performUnitAction } from './game-actions';
import { Animable } from '../components/animable';
import { AppContext } from './app-context';
import { getSlotIdToUnitMap, getUnitsInAttackRange } from '../features/units';

interface Props {
  onDone: () => void;
}

const CURRENT_UNIT_Y_OFFSET = 10;
const QUEUE_UNIT_SIZE = 80;
const QUEUE_UNIT_OFFSET = 10;

const TEAM_SLOT_X_OFFSET = 10;
const PLAYER_TEAM_ANCHOR = new PIXI.Point(0, 0.5);
const ENEMY_TEAM_ANCHOR = new PIXI.Point(1, 0.5);
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

const getAttackDetails = (action: UnitActions) => {
  if (action.type === 'attack-action') {
    return `${action.minDmg} - ${action.maxDmg}`;
  } else {
    return `${action.minHeal} - ${action.maxHeal}`;
  }
};

const getChanceDetails = (stat: Stat) => {
  return `${stat.current * 100}%`;
};

const getHealthDetails = (stat: Stat) => {
  return `${stat.current}/${stat.max}`;
};

const getTeamConfig: (
  viewportWidth: number
) => {
  team: 'enemy' | 'player';
  x: number;
  orientation: 'left' | 'right';
  anchor: PIXI.Point;
}[] = (viewportWidth) => [
  {
    team: 'player',
    x: TEAM_SLOT_X_OFFSET,
    orientation: 'right',
    anchor: PLAYER_TEAM_ANCHOR,
  },
  {
    team: 'enemy',
    x: viewportWidth - TEAM_SLOT_X_OFFSET,
    orientation: 'left',
    anchor: ENEMY_TEAM_ANCHOR,
  },
];

export const BattleStageComponent: React.FC<Props> = ({ onDone }) => {
  const { width: viewportWidth, height: viewportHeight, tweenManager } = React.useContext(
    AppContext
  );
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;
  const turnCount = useSelector<RootState, number>((state) => state.game.turnCount);
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const currentTurnUnitId = useSelector<RootState, string>((state) => state.game.currentTurnUnitId);
  const upcomingTurnUnitIds = useSelector<RootState, string[]>(
    (state) => state.game.upcomingTurnUnitIds
  );
  const unitsInAttackingRange =
    currentTurnUnitId !== '' ? getUnitsInAttackRange(units, currentTurnUnitId) : [];
  const slotIdToUnit = getSlotIdToUnitMap(units);

  const dispatch = useDispatch();

  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

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
    if (units[currentTurnUnitId] && units[currentTurnUnitId].slot.name === 'enemy') {
      setTimeout(() => {
        const targets = getUnitsInAttackRange(units, currentTurnUnitId);
        if (!targets.length) {
          return;
        }
        performUnitAction(
          units[currentTurnUnitId],
          (dmgAmount, isCrit) => {
            dispatch(
              unitsSlice.actions.dmgUnit({
                sourceUnitId: units[currentTurnUnitId].id,
                targets: [
                  {
                    unitId: slotIdToUnit[targets[0].name][targets[0].id].id,
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
                sourceUnitId: units[currentTurnUnitId].id,
                targets: [
                  {
                    unitId: units[currentTurnUnitId].id,
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
                sourceUnitId: units[currentTurnUnitId].id,
                targetUnitIds: [slotIdToUnit[targets[0].name][targets[0].id].id],
              })
            );
          }
        );
      }, 1000);
    }
  }, [units, currentTurnUnitId]);

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };
  const onMouseOut = () => {
    setMouseOverUnitId(undefined);
  };
  const unitClick = (unitId: string) => () => {
    if (units[currentTurnUnitId].slot.name === 'enemy' || unitIsDead(units[currentTurnUnitId])) {
      return;
    }
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

  const renderUnitBackground: RenderCallback = ({ x, y, width, height, slot }) => {
    return (
      <Container key={slot.id} x={x} y={y}>
        <Rect width={width} height={height} fillColor={0x00ff00} />
      </Container>
    );
  };

  const renderUnitForeground: (team: string) => RenderCallback = (team: string) => ({
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
        mouseover={onMouseOver(unit.id)}
        mouseout={onMouseOut}
        click={unitClick(unit.id)}
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
        mouseover={onMouseOver(currentTurnUnitId)}
        mouseout={onMouseOut}
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
            mouseover={onMouseOver(unit.id)}
            mouseout={onMouseOut}
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
      {getTeamConfig(viewportWidth).map(({ x, orientation, team, anchor }) => {
        return (
          <TeamContainer
            key={team}
            x={x}
            y={viewportCenterY}
            name={team}
            label={'Enemy Team'}
            rows={3}
            columns={2}
            orientation={orientation}
            anchor={anchor}
            renderBackground={renderUnitBackground}
            renderForeground={renderUnitForeground(team)}
          />
        );
      })}
      {units[currentTurnUnitId] &&
        [
          'Name: ' + units[currentTurnUnitId].name,
          'Health: ' + getHealthDetails(units[currentTurnUnitId].stats.hp),
          'Attack: ' + getAttackDetails(units[currentTurnUnitId].action),
          'Hit Chance: ' + getChanceDetails(units[currentTurnUnitId].stats.hitChance),
          'Crit Chance: ' + getChanceDetails(units[currentTurnUnitId].stats.critChance),
        ].map((text, index) => (
          <Text
            key={`${index}`}
            x={30}
            y={20 + index * 30}
            text={text}
            anchor={new PIXI.Point(0, 0)}
            style={{ fontSize: 18, fontWeight: 'bold' }}
          />
        ))}
      {mouseOverUnitId &&
        units[mouseOverUnitId] &&
        [
          'Name: ' + units[mouseOverUnitId].name,
          'Health: ' + getHealthDetails(units[mouseOverUnitId].stats.hp),
          'Attack: ' + getAttackDetails(units[mouseOverUnitId].action),
          'Hit Chance: ' + getChanceDetails(units[mouseOverUnitId].stats.hitChance),
          'Crit Chance: ' + getChanceDetails(units[mouseOverUnitId].stats.critChance),
        ].map((text, index) => (
          <Text
            key={`${index}`}
            x={200}
            y={20 + index * 30}
            text={text}
            anchor={new PIXI.Point(0, 0)}
            style={{ fontSize: 18, fontWeight: 'bold' }}
          />
        ))}
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
