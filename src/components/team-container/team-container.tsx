import * as React from 'react';
import { Rect } from '../rect';
import { Team, Unit } from '../types';
import { UnitComponent } from '../unit-component';

interface Props {
  x: number;
  y: number;
  team: Team;
  units: Unit[];
  orientation: 'left' | 'right';
  anchor: PIXI.Point;
}

const SLOT_SIZE = 150;
const SLOT_SPACER = 10;
const HEIGHT = SLOT_SIZE * 3 + SLOT_SPACER * 2;
const WIDTH = SLOT_SIZE * 2 + SLOT_SPACER;

const selectXPosition = (
  x: number,
  column: number,
  orientation: 'left' | 'right',
  anchor: PIXI.Point
) => {
  const columnOffset = orientation === 'right' ? column : 1 - column;
  return x + columnOffset * (SLOT_SIZE + SLOT_SPACER) - anchor.x * WIDTH;
};

const selectYPosition = (y: number, row: number, anchor: PIXI.Point) => {
  return y + row * (SLOT_SIZE + SLOT_SPACER) - anchor.y * HEIGHT;
};

export const TeamContainer: React.FC<Props> = ({ x, y, orientation, team, units, anchor }) => {
  return (
    <>
      {Object.entries(team.battleSlots).map(([id, { column, row }]) => {
        return (
          <Rect
            key={id}
            x={selectXPosition(x, column, orientation, anchor)}
            y={selectYPosition(y, row, anchor)}
            width={SLOT_SIZE}
            height={SLOT_SIZE}
            fill={0x00ff00}
          />
        );
      })}
      {units.map((unit) => {
        const { id, slotId } = unit;
        const { column, row } = team.battleSlots[slotId];
        return (
          <UnitComponent
            key={id}
            x={selectXPosition(x, column, orientation, anchor)}
            y={selectYPosition(y, row, anchor)}
            width={SLOT_SIZE}
            height={SLOT_SIZE}
            unit={unit}
          />
        );
      })}
    </>
  );
};
