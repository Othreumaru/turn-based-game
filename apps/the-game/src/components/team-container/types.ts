import { SlotPointer } from '../types';

export interface RenderData {
  slot: SlotPointer;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RenderCallback = (data: RenderData) => any;
