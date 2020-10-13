import { SlotPointer } from '../../components/types';

export interface SwapAction {
  sourceUnitId: string;
  targetUnitId: string;
}

export interface MoveUnitToEmptySlotAction {
  unitId: string;
  slot: SlotPointer;
}
