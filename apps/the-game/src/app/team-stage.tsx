import * as React from 'react';
import * as PIXI from 'pixi.js';
import { Container, Text } from 'react-pixi-fiber';
import { Button } from '../components/button/button';
import { UnitComponent } from '../components/unit-component';
import { Rect } from '../components/rect';
import { TeamContainer } from '../components/team-container/team-container';
import { AppContext } from './app-context';
import { CENTER_X_BOTTOM_Y_ANCHOR, LEFT_X_CENTER_Y_ANCHOR } from '../utils';
import { useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { UnitMap } from '../components/types';
import { useState } from 'react';
import { BenchMap } from '../features/team-chooser';

interface Props {
  onDone: () => void;
}

const TEAM_SLOT_X_OFFSET = 10;
const BENCH_SLOT_Y_OFFSET = 10;

const MOUSE_OVER_LINE_COLOR = 0xff0000;

export const TeamStageComponent: React.FC<Props> = ({ onDone }) => {
  const { width: viewportWidth, height: viewportHeight, tweenManager } = React.useContext(
    AppContext
  );
  const viewportCenterY = viewportHeight / 2;
  const viewportCenterX = viewportWidth / 2;
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const bench = useSelector<RootState, BenchMap>((state) => state.teamChooser.unitsOnBench);
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
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
      >
        {({ slot, x, y, width, height }) => {
          const unit = Object.values(units)
            .filter((u) => u.team === 'player')
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
              mouseout={() => {}}
              click={() => {}}
            >
              <UnitComponent
                width={width}
                height={height}
                unit={unit}
                tweenManager={tweenManager}
              />
              <Rect
                width={width}
                height={height}
                lineColor={MOUSE_OVER_LINE_COLOR}
                lineWidth={3}
                alpha={mouseOverUnitId === unit.id ? 1 : 0}
              />
            </Container>
          ) : null;
        }}
      </TeamContainer>
      <TeamContainer
        x={viewportCenterX}
        y={viewportHeight - BENCH_SLOT_Y_OFFSET}
        name={'bench'}
        label={'Bench Units'}
        columns={6}
        rows={1}
        orientation={'right'}
        anchor={CENTER_X_BOTTOM_Y_ANCHOR}
      >
        {({ slot, x, y, width, height }) => {
          const unit = Object.values(units)
            .filter((u) => u.team === 'player')
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
              mouseout={() => {}}
              click={() => {}}
            >
              <UnitComponent
                width={width}
                height={height}
                unit={unit}
                tweenManager={tweenManager}
              />
              <Rect
                width={width}
                height={height}
                lineColor={MOUSE_OVER_LINE_COLOR}
                lineWidth={3}
                alpha={mouseOverUnitId === unit.id ? 1 : 0}
              />
            </Container>
          ) : null;
        }}
      </TeamContainer>
      <Text
        text={`Slots on bench ${Object.keys(bench).length}`}
        anchor={new PIXI.Point(0, 0)}
        style={{ fontSize: 18, fontWeight: 'bold' }}
      />
      <Button y={100} width={200} height={30} label={'complete stage'} onClick={onDone} />
    </Container>
  );
};
