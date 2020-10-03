import * as React from 'react';
import { Rect } from '../rect';
import { Team, SlotIds } from '../types';

export interface ChildrenCallbackData {
  slotId: SlotIds;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  x: number;
  y: number;
  slots: Team;
  orientation: 'left' | 'right';
  anchor: PIXI.Point;
  children: (data: ChildrenCallbackData) => any;
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

export const TeamContainer: React.FC<Props> = ({ children, x, y, orientation, slots, anchor }) => {
  return (
    <>
      {Object.entries(slots).map(([id, { column, row }]) => {
        return (
          <Rect
            key={id}
            x={selectXPosition(x, column, orientation, anchor)}
            y={selectYPosition(y, row, anchor)}
            width={SLOT_SIZE}
            height={SLOT_SIZE}
            fillColor={0x00ff00}
          />
        );
      })}
      {typeof children === 'function'
        ? Object.values(slots)
            .map((slot) => {
              return children({
                slotId: slot.id,
                x: selectXPosition(x, slot.column, orientation, anchor),
                y: selectYPosition(y, slot.row, anchor),
                width: SLOT_SIZE,
                height: SLOT_SIZE,
              });
            })
            .filter((c) => !!c)
        : null}
    </>
  );
};
