import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { Button } from '../components/button/button';
import { UnitComponent, UnitDetails } from '../components/unit-component';
import { AppContext } from './app-context';
import { CENTER_X_BOTTOM_Y_ANCHOR, LEFT_X_CENTER_Y_ANCHOR, SMALL_TEXT_FONT_STYLE } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { DraggableContainer } from '../components/draggable-container';
import { DroppableContainer } from '../components/droppable-container';
import { Rect } from '../components/rect';
import {
  getLayoutProjection,
  getSlotIdToUnitMap,
  SlotPointer,
  slotToKey,
  Unit,
} from '../features/units';
import { unitsSlice } from '../features/units';
import { useState } from 'react';
import { GoldLabelComponent } from '../components/gold-label';

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

const TEAM_SLOT_X_OFFSET = 10;
const BENCH_SLOT_Y_OFFSET = 10;

const MOUSE_OVER_LINE_COLOR = 0xff0000;

const playerProjection = getLayoutProjection({
  name: 'player',
  columns: 2,
  rows: 3,
  anchor: LEFT_X_CENTER_Y_ANCHOR,
});

const benchProjection = getLayoutProjection({
  name: 'bench',
  columns: 6,
  rows: 1,
  anchor: CENTER_X_BOTTOM_Y_ANCHOR,
});

export const TeamStageComponent: React.FC<Props> = ({ onDone }) => {
  const { app, width: viewportWidth, height: viewportHeight, tweenManager } = React.useContext(
    AppContext
  );
  const viewportCenterY = viewportHeight / 2;
  const viewportCenterX = viewportWidth / 2;
  const units = useSelector<RootState, Dictionary<Unit>>((state) => state.game.units);
  const maxPlayerUnitsCount = useSelector<RootState, number>((state) => state.game.teamSize);
  const playerUnitsCount = Object.values(units).filter((u) => u.slot.name === 'player').length;
  const slotIdToUnit = useSelector<RootState, any>((state) => getSlotIdToUnitMap(state.game.units));
  const goldCount = useSelector<RootState, number>((state) => state.game.goldCount);
  const teamSlotCost = useSelector<RootState, number>((state) => state.game.costs.teamSlot);
  const dispatch = useDispatch();
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };

  const onStageComplete = () => {
    dispatch(unitsSlice.actions.startGame());
    onDone();
  };

  const increaseTeamSize = () => {
    dispatch(unitsSlice.actions.buyTeamSlot());
  };

  const renderSlot: RenderCallback = ({ x, y, width, height, slot }) => {
    return (
      <DroppableContainer
        key={slotToKey('slots', slot)}
        x={x}
        y={y}
        acceptTags={['unit']}
        width={width}
        height={height}
        debugColor={0xff0000}
        onDrop={(unit: Unit) => {
          if (
            slot.name === 'player' &&
            unit.slot.name !== 'player' &&
            playerUnitsCount >= maxPlayerUnitsCount
          ) {
            return;
          }
          const unitAtLocation: Unit | undefined = slotIdToUnit[slot.name]
            ? slotIdToUnit[slot.name][slot.id]
            : undefined;

          if (unitAtLocation) {
            dispatch(
              unitsSlice.actions.swapUnits({
                sourceUnitId: unit.id,
                targetUnitId: unitAtLocation.id,
              })
            );
          } else {
            dispatch(
              unitsSlice.actions.moveUnitToEmptySlot({
                unitId: unit.id,
                slot: slot,
              })
            );
          }
        }}
      >
        <Rect width={width} height={height} fillColor={0x00ff00} />
      </DroppableContainer>
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
      <DraggableContainer
        key={slotToKey('units', slot)}
        x={x}
        y={y}
        app={app}
        width={width}
        height={height}
        transferObject={unit}
        zIndex={100}
        tags={['unit']}
      >
        <Container interactive={true} mouseover={onMouseOver(unit.id)}>
          <UnitComponent width={width} height={height} unit={unit} tweenManager={tweenManager} />
          <Rect
            width={width}
            height={height}
            lineColor={MOUSE_OVER_LINE_COLOR}
            lineWidth={3}
            alpha={mouseOverUnitId === unit.id ? 1 : 0.1}
          />
        </Container>
      </DraggableContainer>
    ) : null;
  };
  return (
    <Container>
      <Button
        type={goldCount >= teamSlotCost ? 'enabled' : 'disabled'}
        x={80}
        y={265}
        width={120}
        height={30}
        onClick={increaseTeamSize}
      >
        <Text x={10} text={'+1'} style={SMALL_TEXT_FONT_STYLE} />
        <GoldLabelComponent x={80} goldCount={teamSlotCost} />
      </Button>
      <GoldLabelComponent x={viewportCenterX} y={20} goldCount={goldCount} />
      <Text x={20} y={260} text={`(${playerUnitsCount}/${maxPlayerUnitsCount})`} />
      <Container>
        {playerProjection.map(({ x, y, width, height, slot }) =>
          renderSlot({
            slot,
            x: x + TEAM_SLOT_X_OFFSET,
            y: y + viewportCenterY,
            width,
            height,
          })
        )}
        {benchProjection.map(({ x, y, width, height, slot }) =>
          renderSlot({
            slot,
            x: x + viewportCenterX,
            y: y + viewportHeight - BENCH_SLOT_Y_OFFSET,
            width,
            height,
          })
        )}
      </Container>
      <Container sortableChildren={true}>
        {playerProjection
          .map(({ x, y, width, height, slot }) =>
            renderUnit('player')({
              slot,
              x: x + TEAM_SLOT_X_OFFSET,
              y: y + viewportCenterY,
              width,
              height,
            })
          )
          .filter((u) => !!u)}
        {benchProjection
          .map(({ x, y, width, height, slot }) =>
            renderUnit('bench')({
              slot,
              x: x + viewportCenterX,
              y: y + viewportHeight - BENCH_SLOT_Y_OFFSET,
              width,
              height,
            })
          )
          .filter((u) => !!u)}
      </Container>
      {mouseOverUnitId && units[mouseOverUnitId] && (
        <UnitDetails x={30} y={20} unit={units[mouseOverUnitId]} />
      )}
      <Button
        type={playerUnitsCount >= 1 ? 'enabled' : 'disabled'}
        x={viewportWidth - 220}
        y={1000}
        width={200}
        height={30}
        onClick={onStageComplete}
      >
        <Text x={10} text={'complete stage'} />
      </Button>
    </Container>
  );
};
