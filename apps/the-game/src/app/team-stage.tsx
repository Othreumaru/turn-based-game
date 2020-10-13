import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { Button } from '../components/button/button';
import { UnitComponent } from '../components/unit-component';
import { RenderCallback, TeamContainer } from '../components/team-container';
import { AppContext } from './app-context';
import { CENTER_X_BOTTOM_Y_ANCHOR, LEFT_X_CENTER_Y_ANCHOR } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { Unit, UnitMap } from '../components/types';
import { DraggableContainer } from '../components/draggable-container';
import { DroppableContainer } from '../components/droppable-container';
import { Rect } from '../components/rect';
import { getSlotIdToUnitMap } from '../features/units/selectors';
import { unitsSlice } from '../features/units';

interface Props {
  onDone: () => void;
}

const TEAM_SLOT_X_OFFSET = 10;
const BENCH_SLOT_Y_OFFSET = 10;

// const MOUSE_OVER_LINE_COLOR = 0xff0000;

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

  const renderUnitBackground: RenderCallback = ({ x, y, width, height, slot }) => {
    return (
      <Container key={slot.id} x={x} y={y}>
        <DroppableContainer
          acceptTags={['unit']}
          width={width}
          height={height}
          debugColor={0xff0000}
          onDrop={(unit: Unit) => {
            const unitAtLocation: Unit = slotIdToUnit[slot.name][slot.id];

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
        />
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
      <Container key={slot.id} x={x} y={y}>
        <DraggableContainer
          app={app}
          width={width}
          height={height}
          transferObject={unit}
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
      </Container>
    ) : null;
  };

  return (
    <Container>
      <TeamContainer
        x={TEAM_SLOT_X_OFFSET}
        y={viewportCenterY}
        name={'player'}
        label={'Player Team'}
        columns={2}
        rows={3}
        orientation={'right'}
        anchor={LEFT_X_CENTER_Y_ANCHOR}
        renderBackground={renderUnitBackground}
        renderForeground={renderUnitForeground('player')}
      />
      <TeamContainer
        x={viewportCenterX}
        y={viewportHeight - BENCH_SLOT_Y_OFFSET}
        name={'bench'}
        label={'Bench Units'}
        columns={6}
        rows={1}
        orientation={'right'}
        anchor={CENTER_X_BOTTOM_Y_ANCHOR}
        renderBackground={renderUnitBackground}
        renderForeground={renderUnitForeground('bench')}
      />
      <Button y={100} width={200} height={30} label={'complete stage'} onClick={onDone} />
    </Container>
  );
};
