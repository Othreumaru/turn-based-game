import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { Button } from '../components/button/button';
import { UnitComponent } from '../components/unit-component';
import { AppContext } from './app-context';
import { CENTER_X_BOTTOM_Y_ANCHOR, LEFT_X_CENTER_Y_ANCHOR } from '../utils';
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
  UnitMap,
} from '../features/units';
import { unitsSlice } from '../features/units';

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

// const MOUSE_OVER_LINE_COLOR = 0xff0000;

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
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const slotIdToUnit = useSelector<RootState, any>((state) => getSlotIdToUnitMap(state.game.units));
  const dispatch = useDispatch();
  // const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  /*const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };*/

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
          const unitAtLocation: Unit | undefined = slotIdToUnit[slot.name]?.[slot.id];

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
        <UnitComponent width={width} height={height} unit={unit} tweenManager={tweenManager} />
        {/*<Rect
                width={width}
                height={height}
                lineColor={MOUSE_OVER_LINE_COLOR}
                lineWidth={3}
                alpha={mouseOverUnitId === unit.id ? 1 : 0}
              />*/}
      </DraggableContainer>
    ) : null;
  };
  return (
    <Container>
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
      <Button y={100} width={200} height={30} label={'complete stage'} onClick={onDone} />
    </Container>
  );
};
