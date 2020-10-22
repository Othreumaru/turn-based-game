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
  id: string;
  type: 'attack-action';
  name: string;
  targetTeam: 'player' | 'enemy';
  range: 'self' | 'closest' | 'any' | 'all';
  description: string;
  minDmg: number;
  maxDmg: number;
}

export interface DefensiveStanceAction {
  id: string;
  type: 'defensive-stance-action';
  name: string;
  targetTeam: 'player';
  description: string;
  range: 'self';
}

export interface HealAction {
  id: string;
  type: 'heal-action';
  name: string;
  targetTeam: 'player' | 'enemy';
  range: 'closest' | 'any' | 'all';
  description: string;
  minHeal: number;
  maxHeal: number;
}

export type UnitActions = AttackAction | DefensiveStanceAction | HealAction;

export interface ActionMap {
  [key: string]: UnitActions;
}

export interface Unit {
  id: string;
  slot: SlotPointer;
  name: string;
  stats: Stats;
  actions: ActionMap;
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

export interface BuffEffect {
  sourceUnitId: string;
  buffs: string[];
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
