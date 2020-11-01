import { v4 as uuidv4 } from 'uuid';
import { toSlotId } from './utils';
import { Stats, Unit } from './types';
import { createBasicEnemyAction, createBasicPlayerAction } from './create-action';
import { listToMap } from '../../utils';

const createInitStats = (overrides: Partial<Stats> = {}): Stats => {
  return {
    hp: { current: 10, max: 10 },
    level: { current: 1, max: 60 },
    xp: { current: 0, max: 1000 },
    initiative: { current: 70, max: 100 },
    hitChance: { current: 0.8, max: 1 },
    critChance: { current: 0.2, max: 1 },
    critMult: { current: 2, max: 10 },
    missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    buffGivenCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    buffReceivedCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    shield: { current: 0, max: Number.MAX_SAFE_INTEGER },
    threat: { current: 0, max: Number.MAX_SAFE_INTEGER },
    ...overrides,
  };
};

export const createWarrior = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: createInitStats(),
    buffs: [],
    actions: listToMap([
      createBasicPlayerAction('closest')('Sword Swing')([{ stat: 'hp', mod: -2 }]),
      createBasicPlayerAction('self')('Protective Barrier')([
        { stat: 'shield', mod: 2 },
        { stat: 'threat', mod: 2 },
      ]),
    ]),
    tags: [],
    portrait: {
      img: 'portraits/195.png',
      textureXOffset: -0.24,
      textureYOffset: -0.12,
      textureXScale: 2,
      textureYScale: 2,
    },
  };
};

export const createHealer = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: createInitStats({ hp: { current: 6, max: 6 } }),
    buffs: [],
    actions: listToMap([createBasicPlayerAction('self')('Heal')([{ stat: 'hp', mod: 3 }])]),
    tags: [],
    portrait: {
      img: 'portraits/184.png',
      textureXOffset: -0.24,
      textureYOffset: -0.04,
      textureXScale: 2,
      textureYScale: 2,
    },
  };
};

export const createOrc = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: createInitStats({ hp: { current: 12, max: 12 } }),
    buffs: [],
    actions: listToMap([createBasicEnemyAction('closest')('Smash')([{ stat: 'hp', mod: -2 }])]),
    tags: [],
    portrait: {
      img: 'portraits/103.png',
      textureXOffset: -0.24,
      textureYOffset: -0.06,
      textureXScale: 2,
      textureYScale: 2,
    },
  };
};

export const createGoblin = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: createInitStats({ hp: { current: 4, max: 4 }, critChance: { current: 0.6, max: 1 } }),
    buffs: [],
    actions: listToMap([
      createBasicEnemyAction('any')('Poisoned Arrow')([{ stat: 'hp', mod: -4 }]),
    ]),
    tags: [],
    portrait: {
      img: 'portraits/82.png',
      textureXOffset: -0.26,
      textureYOffset: -0.03,
      textureXScale: 2,
      textureYScale: 2,
    },
  };
};
