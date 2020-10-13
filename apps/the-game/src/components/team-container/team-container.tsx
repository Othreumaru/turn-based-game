import * as React from 'react';
import { Rect } from '../rect';
import { SlotPointer } from '../types';
import { getLayout, LEFT_X_TOP_Y_ANCHOR } from '../../utils';
import { Text } from 'react-pixi-fiber';

export interface ChildrenCallbackData {
  slot: SlotPointer;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  x: number;
  y: number;
  rows: number;
  columns: number;
  name: string;
  label: string;
  orientation: 'left' | 'right';
  anchor: PIXI.Point;
  children: (data: ChildrenCallbackData) => any;
  slotSize?: number;
  slotSpacer?: number;
}

const SLOT_SIZE = 150;
const SLOT_SPACER = 10;

const getWidth = (rows: number, slotSize: number, slotSpacer: number) =>
  rows * (slotSize + slotSpacer) - slotSpacer;

const getHeight = (columns: number, slotSize: number, slotSpacer: number) =>
  columns * (slotSize + slotSpacer) - slotSpacer;

const selectXPosition = (
  x: number,
  slotSize: number,
  slotSpacer: number,
  column: number,
  orientation: 'left' | 'right'
) => {
  const columnOffset = orientation === 'right' ? column : 1 - column;
  return x + columnOffset * (slotSize + slotSpacer);
};

const selectYPosition = (y: number, height: number, slotSpacer: number, row: number) => {
  return y + row * (height + slotSpacer);
};

export const TeamContainer: React.FC<Props> = ({
  children,
  name,
  label,
  x,
  y,
  rows,
  columns,
  orientation,
  anchor,
  slotSize = SLOT_SIZE,
  slotSpacer = SLOT_SPACER,
}) => {
  const width = getWidth(columns, slotSize, slotSpacer);
  const height = getHeight(rows, slotSize, slotSpacer);
  const xPos = x - anchor.x * width;
  const yPos = y - anchor.y * height;
  return (
    <>
      <Text
        x={xPos}
        y={yPos - 22}
        text={label}
        anchor={LEFT_X_TOP_Y_ANCHOR}
        style={{ fontSize: 18, fontWeight: 'bold' }}
      />
      {getLayout(name, rows, columns).map(({ id, column, row }) => {
        return (
          <Rect
            key={id}
            x={selectXPosition(xPos, slotSize, slotSpacer, column, orientation)}
            y={selectYPosition(yPos, slotSize, slotSpacer, row)}
            width={slotSize}
            height={slotSize}
            fillColor={0x00ff00}
          />
        );
      })}
      {typeof children === 'function'
        ? getLayout(name, rows, columns)
            .map(({ id, row, column }) => {
              return children({
                slot: { id, name, row, column },
                x: selectXPosition(xPos, slotSize, slotSpacer, column, orientation),
                y: selectYPosition(yPos, slotSize, slotSpacer, row),
                width: slotSize,
                height: slotSize,
              });
            })
            .filter((c) => !!c)
        : null}
    </>
  );
};
