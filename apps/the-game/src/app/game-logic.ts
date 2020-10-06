import { Team, Unit } from '../components/types';

export const SLOTS: Team = {
  slot00: { id: 'slot00', column: 0, row: 0 },
  slot01: { id: 'slot01', column: 0, row: 1 },
  slot02: { id: 'slot02', column: 0, row: 2 },
  slot10: { id: 'slot10', column: 1, row: 0 },
  slot11: { id: 'slot11', column: 1, row: 1 },
  slot12: { id: 'slot12', column: 1, row: 2 },
};

export const unitIsAlive = (unit: Unit) => unit.stats.hp.current > 0;
export const unitIsDead = (unit: Unit) => !unitIsAlive(unit);
