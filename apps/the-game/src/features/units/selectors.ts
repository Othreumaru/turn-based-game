import { SlotPointer, Unit, UnitMap } from '../../components/types';

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
export const getUnitsInAttackRange = (units: UnitMap, sourceUnitId: string): SlotPointer[] => {
  const source = units[sourceUnitId];
  const aliveUnits = Object.values(units).filter((u) => u.stats.hp.current > 0);
  const aliveEnemyUnits = aliveUnits.filter(isEnemy);
  const alivePlayerUnits = aliveUnits.filter(isPlayer);
  const myTeamUnits = isPlayer(source) ? alivePlayerUnits : aliveEnemyUnits;
  const oppositeTeamUnits = isPlayer(source) ? aliveEnemyUnits : alivePlayerUnits;
  const thereAreUnitsInFirstColumn =
    oppositeTeamUnits.filter((u) => u.slot.column === 1).length !== 0;

  if (source.action.type === 'attack-action') {
    if (source.action.range === 'closest') {
      if (!oppositeTeamUnits.length) {
        return [];
      }
      if (source.slot.column === 0 && thereAreUnitsInFirstColumn) {
        return [];
      }
      const columnToAttack =
        oppositeTeamUnits.filter((u) => u.slot.column === 1).length !== 0 ? 1 : 0;
      const rowsToAttack =
        source.slot.row === 0 ? [0, 1] : source.slot.row === 1 ? [0, 1, 2] : [1, 2];
      return oppositeTeamUnits
        .filter((u) => columnToAttack === u.slot.column && rowsToAttack.includes(u.slot.row))
        .map((u) => u.slot);
    } else if (source.action.range === 'any') {
      return oppositeTeamUnits.map((p) => p.slot);
    } else if (source.action.range === 'all') {
      return [];
    }
    return [];
  }
  if (source.action.type === 'heal-action') {
    if (source.action.range === 'any') {
      if (source.action.targetTeam === 'player') {
        return myTeamUnits.map((p) => p.slot);
      }
    } else {
      return [];
    }
  }
  return [];
};
