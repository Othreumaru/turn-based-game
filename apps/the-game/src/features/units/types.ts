export interface SwapAction {
  sourceUnitId: string;
  targetUnitId: string;
}

export interface MoveUnitToEmptySlotAction {
  unitId: string;
  slot: SlotPointer;
}

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

export interface Game {
  turnCount: number;
  units: UnitMap;
  completedTurnUnitIds: string[];
  currentTurnUnitId: string;
  upcomingTurnUnitIds: string[];
}
