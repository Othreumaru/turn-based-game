export type Slot00ID = 'slot00';
export type Slot01ID = 'slot01';
export type Slot02ID = 'slot02';
export type Slot10ID = 'slot10';
export type Slot11ID = 'slot11';
export type Slot12ID = 'slot12';

export type Slot00 = { id: Slot00ID; column: 0; row: 0 };
export type Slot01 = { id: Slot01ID; column: 0; row: 1 };
export type Slot02 = { id: Slot02ID; column: 0; row: 2 };
export type Slot10 = { id: Slot10ID; column: 1; row: 0 };
export type Slot11 = { id: Slot11ID; column: 1; row: 1 };
export type Slot12 = { id: Slot12ID; column: 1; row: 2 };

export type SlotIds = Slot00ID | Slot01ID | Slot02ID | Slot10ID | Slot11ID | Slot12ID;

export interface SlotPointer {
  id: string;
  name: string;
  row: number;
  column: number;
}

export interface Stat {
  current: number;
  max: number;
}

export interface Stats {
  hp: Stat;
  hitChance: Stat;
  critChance: Stat;
  critMult: Stat;
  xp: Stat;
  level: Stat;
  initiative: Stat;
  missCount: Stat;
  attackCount: Stat;
}

export interface AttackAction {
  type: 'attack-action';
  targetTeam: 'player' | 'enemy';
  range: 'closest' | 'any' | 'all';
  minDmg: number;
  maxDmg: number;
}

export interface HealAction {
  type: 'heal-action';
  targetTeam: 'player' | 'enemy';
  range: 'closest' | 'any' | 'all';
  minHeal: number;
  maxHeal: number;
}

export type UnitActions = AttackAction | HealAction;

export interface Unit {
  id: string;
  slot: SlotPointer;
  name: string;
  stats: Stats;
  action: UnitActions;
  tags: string[];
}

export interface UnitMap {
  [key: string]: Unit;
}

export interface Team {
  slot00: Slot00;
  slot01: Slot01;
  slot02: Slot02;
  slot10: Slot10;
  slot11: Slot11;
  slot12: Slot12;
}

export interface DmgEffect {
  sourceUnitId: string;
  targets: {
    unitId: string;
    isCrit: boolean;
    dmgAmount: number;
  }[];
}

export interface HealEffect {
  sourceUnitId: string;
  targets: {
    unitId: string;
    isCrit: boolean;
    healAmount: number;
  }[];
}

export interface MissEffect {
  sourceUnitId: string;
  targetUnitIds: string[];
}

export interface SpawnEffect {
  type: 'spawn-effect';
  unit: Unit;
}

export interface EndTurnEffect {
  type: 'end-turn-effect';
}

export type Effect = SpawnEffect | DmgEffect | HealEffect | MissEffect | EndTurnEffect;

export interface Game {
  turnCount: number;
  units: UnitMap;
  completedTurnUnitIds: string[];
  currentTurnUnitId: string;
  upcomingTurnUnitIds: string[];
}
