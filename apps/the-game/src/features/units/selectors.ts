import { SlotPointer, Unit } from './types';

export const unitIsAlive = (unit: Unit) => unit.stats.hp.current > 0;
export const unitIsDead = (unit: Unit) => !unitIsAlive(unit);
export const unitIsPlayer = (unit: Unit) => unit.slot.name === 'player';
export const unitIsEnemy = (unit: Unit) => unit.slot.name === 'enemy';
export const unitIsBench = (unit: Unit) => unit.slot.name === 'bench';
export const getTeam = (unit: Unit) => unit.slot.name;
export const getOppositeTeam = (unit: Unit) => (unit.slot.name === 'player' ? 'enemy' : 'player');
export const getShieldCount = (unit: Unit): number => {
  return unit.buffs.reduce(
    (acc, buff) => (buff.statName === 'shield' ? acc + buff.value : acc),
    unit.stats.shield.current
  );
};
export const getThreatCount = (unit: Unit): number => {
  return unit.buffs.reduce(
    (acc, buff) => (buff.statName === 'threat' ? acc + buff.value : acc),
    unit.stats.shield.current
  );
};
export const getAliveUnits = (units: Dictionary<Unit>) =>
  Object.values(units).filter((u) => u.stats.hp.current > 0);
export const getAlivePlayerUnits = (units: Dictionary<Unit>) =>
  getAliveUnits(units).filter(unitIsPlayer);
export const getAliveEnemyUnits = (units: Dictionary<Unit>) =>
  getAliveUnits(units).filter(unitIsEnemy);

export const getSlotIdToUnitMap = (units: Dictionary<Unit>) =>
  Object.values(units).reduce((acc, unit) => {
    if (!acc[unit.slot.name]) {
      acc[unit.slot.name] = {};
    }
    acc[unit.slot.name][unit.slot.id] = unit;
    return acc;
  }, {} as any);
export const getUnitsInAttackRange = (
  units: Dictionary<Unit>,
  sourceUnitId: string,
  actionId: string
): SlotPointer[] => {
  const source = units[sourceUnitId];
  const aliveEnemyUnits = getAliveEnemyUnits(units);
  const alivePlayerUnits = getAlivePlayerUnits(units);
  const oppositeTeamUnits = unitIsPlayer(source) ? aliveEnemyUnits : alivePlayerUnits;
  const thereAreUnitsInFirstColumn =
    oppositeTeamUnits.filter((u) => u.slot.column === 1).length !== 0;

  const action = source.actions[actionId];

  if (!action) {
    return [];
  }

  if (action.type === 'basic-action') {
    if (action.range === 'closest') {
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
    } else if (action.range === 'any') {
      return oppositeTeamUnits.map((p) => p.slot);
    } else if (action.range === 'all') {
      return [];
    }
    return [];
  }
  return [];
};
