import { AttackAction, HealAction, SlotPointer, Unit } from './types';
import { getRandomInt, LEFT_X_TOP_Y_ANCHOR, rollChance } from '../../utils';

export const toSlotId = (column: number, row: number) => `${column}x${row}`;
export const slotToKey = (prefix: string, slot: SlotPointer) => {
  return `${prefix}:${slot.name}:${slot.column}x${slot.row}`;
};

export interface GetPixelLayoutProps {
  name: string;
  rows: number;
  columns: number;
  anchor?: PIXI.Point;
  slotSize?: number;
  slotSpacer?: number;
  mirrorX?: boolean;
}

export interface ProjectedSlotPointer {
  slot: SlotPointer;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getLayout = (name: string, rows: number, columns: number): SlotPointer[] =>
  Array.from({ length: rows * columns }).map((_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      id: toSlotId(column, row),
      name,
      column,
      row,
    };
  });

export const getLayoutProjection = (props: GetPixelLayoutProps): ProjectedSlotPointer[] => {
  const {
    name = '',
    rows = 0,
    columns = 0,
    slotSize = 150,
    slotSpacer = 10,
    mirrorX = false,
    anchor = LEFT_X_TOP_Y_ANCHOR,
  } = props;

  const segmentWith = slotSize + slotSpacer;
  const offsetX = anchor.x * (columns * segmentWith);
  const offsetY = anchor.y * (rows * segmentWith);

  return getLayout(name, rows, columns).map(({ id, column, row }) => {
    const columnOffset = mirrorX ? columns - column : column;

    return {
      slot: { id, name, row, column },
      x: columnOffset * segmentWith - offsetX,
      y: row * segmentWith - offsetY,
      width: slotSize,
      height: slotSize,
    };
  });
};

export const attackUnit = (
  sourceUnit: Unit,
  attackAction: AttackAction,
  onAttack: (dmgAmount: number, isCrit: boolean) => void,
  onMiss: () => void
) => {
  let isCrit = false;
  let dmgAmount = 0;
  if (rollChance(sourceUnit.stats.hitChance.current)) {
    const baseDmgAmount = getRandomInt(attackAction.minDmg, attackAction.maxDmg);
    if (rollChance(sourceUnit.stats.critChance.current)) {
      isCrit = true;
      dmgAmount = baseDmgAmount * sourceUnit.stats.critMult.current;
    } else {
      isCrit = false;
      dmgAmount = baseDmgAmount;
    }
    onAttack(dmgAmount, isCrit);
  } else {
    onMiss();
  }
};

export const healUnit = (
  sourceUnit: Unit,
  healAction: HealAction,
  onHeal: (healAmount: number, isCrit: boolean) => void,
  onMiss: () => void
) => {
  let isCrit = false;
  let healAmount = 0;
  if (rollChance(sourceUnit.stats.hitChance.current)) {
    const baseHealAmount = getRandomInt(healAction.minHeal, healAction.maxHeal);
    if (rollChance(sourceUnit.stats.critChance.current)) {
      isCrit = true;
      healAmount = baseHealAmount * sourceUnit.stats.critMult.current;
    } else {
      isCrit = false;
      healAmount = baseHealAmount;
    }
    onHeal(healAmount, isCrit);
  } else {
    onMiss();
  }
};

export const performUnitAction = (
  sourceUnit: Unit,
  onAttack: (dmgAmount: number, isCrit: boolean) => void,
  onHeal: (healAmount: number, isCrit: boolean) => void,
  onMiss: () => void
) => {
  if (sourceUnit.action.type === 'attack-action') {
    attackUnit(sourceUnit, sourceUnit.action, onAttack, onMiss);
  } else if (sourceUnit.action.type === 'heal-action') {
    healUnit(sourceUnit, sourceUnit.action, onHeal, onMiss);
  }
};
