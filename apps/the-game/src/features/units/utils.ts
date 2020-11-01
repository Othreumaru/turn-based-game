import { SlotPointer } from './types';
import { LEFT_X_TOP_Y_ANCHOR } from '../../utils';

export const toSlotId = (column: number, row: number) => `${column}x${row}`;
export const slotToKey = (prefix: string, slot: SlotPointer) => {
  return `${prefix}:${slot.name}:${slot.column}x${slot.row}`;
};

export interface GetPixelLayoutProps {
  name: string;
  rows: number;
  columns: number;
  anchor?: PIXI.Point;
  slotSize?: number;
  slotSpacer?: number;
  mirrorX?: boolean;
}

export interface ProjectedSlotPointer {
  slot: SlotPointer;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getLayout = (name: string, rows: number, columns: number): SlotPointer[] =>
  Array.from({ length: rows * columns }).map((_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      id: toSlotId(column, row),
      name,
      column,
      row,
    };
  });

export const getLayoutProjection = (props: GetPixelLayoutProps): ProjectedSlotPointer[] => {
  const {
    name = '',
    rows = 0,
    columns = 0,
    slotSize = 150,
    slotSpacer = 10,
    mirrorX = false,
    anchor = LEFT_X_TOP_Y_ANCHOR,
  } = props;

  const segmentWith = slotSize + slotSpacer;
  const offsetX = anchor.x * (columns * segmentWith);
  const offsetY = anchor.y * (rows * segmentWith);

  return getLayout(name, rows, columns).map(({ id, column, row }) => {
    const columnOffset = mirrorX ? columns - column - 1 : column;

    return {
      slot: { id, name, row, column },
      x: columnOffset * segmentWith - offsetX,
      y: row * segmentWith - offsetY,
      width: slotSize,
      height: slotSize,
    };
  });
};

export const slotEquals = (slotA: SlotPointer) => (slotB: SlotPointer) => {
  return slotA.name === slotB.name && slotA.column === slotB.column && slotA.row === slotB.row;
};
