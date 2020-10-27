import { v4 as uuidv4 } from 'uuid';
import { toSlotId } from './utils';
import { Unit } from './types';
import { createAttackAction, createDefensiveStanceAction, createHealAction } from './create-action';
import { listToMap } from '../../utils';

export const createWarrior = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: {
      hp: { current: 10, max: 10 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 70, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      shield: { current: 0, max: Number.MAX_SAFE_INTEGER },
      threat: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    actions: [
      createAttackAction('Sword Swing', 'closest', 2),
      createDefensiveStanceAction(),
    ].reduce(listToMap, {}),
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
    stats: {
      hp: { current: 6, max: 6 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 30, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      shield: { current: 0, max: Number.MAX_SAFE_INTEGER },
      threat: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    actions: [createHealAction(), createDefensiveStanceAction()].reduce(listToMap, {}),
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
    stats: {
      hp: { current: 12, max: 12 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 40, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      shield: { current: 0, max: Number.MAX_SAFE_INTEGER },
      threat: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    actions: [createAttackAction('Smash', 'closest', 2)].reduce(listToMap, {}),
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
    stats: {
      hp: { current: 4, max: 4 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 40, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.6, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      shield: { current: 0, max: Number.MAX_SAFE_INTEGER },
      threat: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    actions: [createAttackAction('Poisoned Arrow', 'any', 4)].reduce(listToMap, {}),
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
