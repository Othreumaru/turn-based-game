import * as React from 'react';
import * as PIXI from 'pixi.js';
import { Container, Text } from 'react-pixi-fiber';
import { Button } from '../components/button/button';
import { SLOTS } from './game-logic';
import { UnitComponent } from '../components/unit-component';
import { Rect } from '../components/rect';
import { TeamContainer } from '../components/team-container/team-container';
import { AppContext } from './app-context';
import { LEFT_X_CENTER_Y_ANCHOR } from '../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from './root-reducer';
import { UnitMap } from '../components/types';
import { useState } from 'react';

interface Props {
  onDone: () => void;
}

const TEAM_SLOT_X_OFFSET = 10;
const MOUSE_OVER_LINE_COLOR = 0xff0000;

export const TeamStageComponent: React.FC<Props> = ({ onDone }) => {
  const { height: viewportHeight, tweenManager } = React.useContext(AppContext);
  const viewportCenterY = viewportHeight / 2;
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const [mouseOverUnitId, setMouseOverUnitId] = useState<string>();

  const onMouseOver = (unitId: string) => () => {
    setMouseOverUnitId(unitId);
  };

  return (
    <Container>
      <TeamContainer
        x={TEAM_SLOT_X_OFFSET}
        y={viewportCenterY}
        slots={SLOTS}
        orientation={'left'}
        anchor={LEFT_X_CENTER_Y_ANCHOR}
      >
        {({ slotId, x, y, width, height }) => {
          const unit = Object.values(units)
            .filter((u) => u.team === 'player')
            .find((u) => u.slotId === slotId);
          return unit ? (
            <Container
              key={slotId}
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
        text={'Hello from team select stage'}
        anchor={new PIXI.Point(0, 0)}
        style={{ fontSize: 18, fontWeight: 'bold' }}
      />
      <Button y={100} width={200} height={30} label={'complete stage'} onClick={onDone} />
    </Container>
  );
};
