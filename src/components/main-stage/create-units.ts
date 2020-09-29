import { SlotIds, Unit } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const createWarrior = (slotId: SlotIds): Unit => {
  return {
    id: uuidv4(),
    name: 'warrior',
    team: 'player',
    slotId: slotId,
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 70, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
    },
    action: {
      type: 'attack-action',
      minDmg: 22,
      maxDmg: 28,
    },
    tags: [],
  };
};

export const createHealer = (slotId: SlotIds): Unit => {
  return {
    id: uuidv4(),
    name: 'healer',
    team: 'player',
    slotId: slotId,
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 30, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
    },
    action: {
      type: 'heal-action',
      minHeal: 22,
      maxHeal: 28,
    },
    tags: [],
  };
};

export const createOrc = (slotId: SlotIds): Unit => {
  return {
    id: uuidv4(),
    name: 'orc',
    team: 'enemy',
    slotId: slotId,
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 40, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.2, max: 1 },
      critMult: { current: 2, max: 10 },
    },
    action: {
      type: 'attack-action',
      minDmg: 50,
      maxDmg: 80,
    },
    tags: [],
  };
};

export const createGoblin = (slotId: SlotIds): Unit => {
  return {
    id: uuidv4(),
    name: 'goblin',
    team: 'enemy',
    slotId: slotId,
    stats: {
      hp: { current: 120, max: 120 },
      level: { current: 1, max: 60 },
      xp: { current: 0, max: 1000 },
      initiative: { current: 40, max: 100 },
      hitChance: { current: 0.8, max: 1 },
      critChance: { current: 0.4, max: 1 },
      critMult: { current: 2, max: 10 },
    },
    action: {
      type: 'attack-action',
      minDmg: 15,
      maxDmg: 20,
    },
    tags: [],
  };
};
