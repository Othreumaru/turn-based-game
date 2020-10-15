import { Unit } from '../components/types';
import { v4 as uuidv4 } from 'uuid';
import { toSlotId } from '../utils';

export const createWarrior = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 70, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    action: {
      type: 'attack-action',
      range: 'closest',
      targetTeam: 'enemy',
      minDmg: 22,
      maxDmg: 28,
    },
    tags: [],
  };
};

export const createHealer = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 30, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    action: {
      type: 'heal-action',
      targetTeam: 'player',
      range: 'any',
      minHeal: 22,
      maxHeal: 28,
    },
    tags: [],
  };
};

export const createOrc = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 40, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    action: {
      type: 'attack-action',
      targetTeam: 'player',
      range: 'closest',
      minDmg: 40,
      maxDmg: 60,
    },
    tags: [],
  };
};

export const createGoblin = (name: string, team: string, column: number, row: number): Unit => {
  return {
    id: uuidv4(),
    name: name,
    slot: { id: toSlotId(column, row), name: team, row, column },
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 40, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.6, max: 1 },
      critMult: { current: 2, max: 10 },
      missCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
      attackCount: { current: 0, max: Number.MAX_SAFE_INTEGER },
    },
    action: {
      type: 'attack-action',
      targetTeam: 'player',
      range: 'any',
      minDmg: 15,
      maxDmg: 20,
    },
    tags: [],
  };
};
