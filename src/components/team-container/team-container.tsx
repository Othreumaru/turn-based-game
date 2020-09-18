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

export const TeamContainer: React.FC<Props> = ({ x, y, orientation, team, units }) => {
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
      {units.map((unit) => {
        const { id, slotId } = unit;
        const { column, row } = team.battleSlots[slotId];
        return (
          <UnitComponent
            key={id}
            x={selectXPosition(x, column, orientation)}
            y={selectYPosition(y, row)}
            width={SLOT_SIZE}
            height={SLOT_SIZE}
            unit={unit}
          />
        );
      })}
    </>
  );
};
