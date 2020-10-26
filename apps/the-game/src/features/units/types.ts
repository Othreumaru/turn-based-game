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
  threat: Stat;
}

export interface AttackAction {
  id: string;
  type: 'attack-action';
  name: string;
  targetTeam: 'player' | 'enemy';
  range: 'self' | 'closest' | 'any' | 'all';
  description: string;
  dmg: number;
  threat: number;
}

export interface DefensiveStanceAction {
  id: string;
  type: 'defensive-stance-action';
  name: string;
  targetTeam: 'player';
  description: string;
  range: 'self';
  threat: number;
}

export interface HealAction {
  id: string;
  type: 'heal-action';
  name: string;
  targetTeam: 'player' | 'enemy';
  range: 'closest' | 'any' | 'all';
  description: string;
  heal: number;
  threat: number;
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
  portrait: {
    img: string;
    textureXOffset: number;
    textureYOffset: number;
    textureXScale: number;
    textureYScale: number;
  };
}

export interface UnitMap {
  [key: string]: Unit;
}

export interface DmgEffect {
  sourceUnitId: string;
  threat: number;
  targets: {
    unitId: string;
    isCrit: boolean;
    dmgAmount: number;
  }[];
}

export interface HealEffect {
  sourceUnitId: string;
  threat: number;
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
