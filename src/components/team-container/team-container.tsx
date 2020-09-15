import * as React from 'react';
import * as PIXI from 'pixi.js';
import { Container, Text } from 'react-pixi-fiber';
import { Rect } from '../rect';
import { Team } from '../types';

interface Props {
  x: number;
  y: number;
  team: Team;
  orientation: 'left' | 'right';
}

const SLOT_SIZE = 150;
const SLOT_SPACER = 10;

const selectXPosition = (x: number, column: number, orientation: 'left' | 'right') => {
  const columnOffset = orientation === 'right' ? column : 1 - column;
  return x + columnOffset * (SLOT_SIZE + SLOT_SPACER);
};

const selectYPosition = (y: number, row: number) => {
  return y + row * (SLOT_SIZE + SLOT_SPACER);
};

export const TeamContainer: React.FC<Props> = ({ x, y, orientation, team }) => {
  return (
    <>
      {Object.entries(team.battleSlots).map(([id, { column, row }]) => {
        return (
          <Rect
            key={id}
            x={selectXPosition(x, column, orientation)}
            y={selectYPosition(y, row)}
            width={SLOT_SIZE}
            height={SLOT_SIZE}
            fill={0x00ff00}
          />
        );
      })}
      {team.units.map(({ id, slotId, name, stats }) => {
        const { column, row } = team.battleSlots[slotId];
        return (
          <Container
            key={id}
            x={selectXPosition(x, column, orientation)}
            y={selectYPosition(y, row)}
          >
            <Rect width={SLOT_SIZE} height={SLOT_SIZE} fill={0x0000ff} />
            <Rect y={SLOT_SIZE * 0.8} width={SLOT_SIZE} height={SLOT_SIZE * 0.2} fill={0xffffff} />
            <Rect
              y={SLOT_SIZE * 0.8 * (stats.hp.current / stats.hp.max)}
              width={SLOT_SIZE}
              height={SLOT_SIZE * 0.8 * (1 - stats.hp.current / stats.hp.max)}
              fill={0xff0000}
            />

            <Text text={name} />
            <Text
              x={SLOT_SIZE * 0.5}
              y={SLOT_SIZE * 0.8}
              text={stats.hp.current + '/' + stats.hp.max}
              anchor={new PIXI.Point(0.5, 0)}
              style={{ fontSize: 18, fontWeight: 'bold' }}
            />
          </Container>
        );
      })}
    </>
  );
};
