import { Unit } from '../../components/types';

export type Slot0ID = 'slot0';
export type Slot1ID = 'slot1';
export type Slot2ID = 'slot2';
export type Slot3ID = 'slot3';
export type Slot4ID = 'slot4';
export type Slot5ID = 'slot5';

export type Slot0 = { id: Slot0ID; index: 0 };
export type Slot1 = { id: Slot1ID; index: 1 };
export type Slot2 = { id: Slot2ID; index: 2 };
export type Slot3 = { id: Slot3ID; index: 3 };
export type Slot4 = { id: Slot4ID; index: 4 };
export type Slot5 = { id: Slot5ID; index: 5 };

export type BenchSlotIds = Slot0ID | Slot1ID | Slot2ID | Slot3ID | Slot4ID | Slot5ID;

export interface Bench {
  slot0: Slot0;
  slot1: Slot1;
  slot2: Slot2;
  slot3: Slot3;
  slot4: Slot4;
  slot5: Slot5;
}

export interface SetBenchUnit {
  slot: BenchSlotIds;
  unit: Unit;
}

export type BenchMap = {
  [key in BenchSlotIds]: Unit | undefined;
};

export interface TeamChooser {
  unitsOnBench: BenchMap;
}
