import { Unit } from '../units';

export interface Turn {
  unitId: string;
  selectedActionIndex: number;
}

export interface Battle {
  turnCount: number;
  units: Dictionary<Unit>;
  completedTurns: Turn[];
  currentTurn: undefined | Turn;
  upcomingTurns: Turn[];
}
