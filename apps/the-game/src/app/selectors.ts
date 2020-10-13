import { Unit } from '../components/types';

export const isPlayer = (unit: Unit) => unit.slot.name === 'player';
export const isEnemy = (unit: Unit) => unit.slot.name === 'enemy';
export const isBench = (unit: Unit) => unit.slot.name === 'bench';
export const getTeam = (unit: Unit) => unit.slot.name;
export const getOppositeTeam = (unit: Unit) => (unit.slot.name === 'player' ? 'enemy' : 'player');
