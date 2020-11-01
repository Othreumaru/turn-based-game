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

export interface Buff {
  id: string;
  statName: string;
  value: number;
}

export type Range = 'self' | 'closest' | 'any' | 'all';
export type TargetTeam = 'player' | 'enemy';

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
  buffGivenCount: Stat;
  buffReceivedCount: Stat;
  shield: Stat;
  threat: Stat;
}

export interface StatModifier {
  stat: keyof Stats;
  mod: number;
}

export interface BasicAction {
  id: string;
  type: 'basic-action';
  name: string;
  targetTeam: TargetTeam;
  range: Range;
  props: StatModifier[];
}

export interface ExecuteActionArgs {
  actionId: string;
  targets: SlotPointer[];
}

export type UnitActions = BasicAction;

export interface ActionMap {
  [key: string]: UnitActions;
}

export interface Unit {
  id: string;
  slot: SlotPointer;
  name: string;
  stats: Stats;
  buffs: Buff[];
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
