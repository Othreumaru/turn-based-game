import { Unit, UnitMap } from '../../components/types';

export const isPlayer = (unit: Unit) => unit.slot.name === 'player';
export const isEnemy = (unit: Unit) => unit.slot.name === 'enemy';
export const isBench = (unit: Unit) => unit.slot.name === 'bench';
export const getTeam = (unit: Unit) => unit.slot.name;
export const getOppositeTeam = (unit: Unit) => (unit.slot.name === 'player' ? 'enemy' : 'player');
export const getSlotIdToUnitMap = (units: UnitMap) =>
  Object.values(units).reduce((acc, unit) => {
    if (!acc[unit.slot.name]) {
      acc[unit.slot.name] = {};
    }
    acc[unit.slot.name][unit.slot.id] = unit;
    return acc;
  }, {} as any);
