import { Game } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const getInitialState = (): Game => {
  return {
    playerTeam: {
      battleSlots: {
        slot00: { id: 'slot00', column: 0, row: 0 },
        slot01: { id: 'slot01', column: 0, row: 1 },
        slot02: { id: 'slot02', column: 0, row: 2 },
        slot10: { id: 'slot10', column: 1, row: 0 },
        slot11: { id: 'slot11', column: 1, row: 1 },
        slot12: { id: 'slot12', column: 1, row: 2 },
      },
      units: [
        {
          id: uuidv4(),
          name: 'warrior',
          slotId: 'slot10',
          stats: {
            hp: { current: 120, max: 120 },
            level: { current: 1, max: 60 },
            xp: { current: 0, max: 1000 },
            initiative: { current: 70, max: 100 },
          },
        },
        {
          id: uuidv4(),
          name: 'warrior',
          slotId: 'slot11',
          stats: {
            hp: { current: 120, max: 120 },
            level: { current: 1, max: 60 },
            xp: { current: 0, max: 1000 },
            initiative: { current: 70, max: 100 },
          },
        },
        {
          id: uuidv4(),
          name: 'warrior',
          slotId: 'slot12',
          stats: {
            hp: { current: 120, max: 120 },
            level: { current: 1, max: 60 },
            xp: { current: 0, max: 1000 },
            initiative: { current: 70, max: 100 },
          },
        },
        {
          id: uuidv4(),
          name: 'healer',
          slotId: 'slot01',
          stats: {
            hp: { current: 120, max: 120 },
            level: { current: 1, max: 60 },
            xp: { current: 0, max: 1000 },
            initiative: { current: 30, max: 100 },
          },
        },
      ],
    },
    enemyTeam: {
      battleSlots: {
        slot00: { id: 'slot00', column: 0, row: 0 },
        slot01: { id: 'slot01', column: 0, row: 1 },
        slot02: { id: 'slot02', column: 0, row: 2 },
        slot10: { id: 'slot10', column: 1, row: 0 },
        slot11: { id: 'slot11', column: 1, row: 1 },
        slot12: { id: 'slot12', column: 1, row: 2 },
      },
      units: [
        {
          id: uuidv4(),
          name: 'orc',
          slotId: 'slot11',
          stats: {
            hp: { current: 120, max: 120 },
            level: { current: 1, max: 60 },
            xp: { current: 0, max: 1000 },
            initiative: { current: 40, max: 100 },
          },
        },
        {
          id: uuidv4(),
          name: 'goblin',
          slotId: 'slot01',
          stats: {
            hp: { current: 120, max: 120 },
            level: { current: 1, max: 60 },
            xp: { current: 0, max: 1000 },
            initiative: { current: 80, max: 100 },
          },
        },
      ],
    },
    turnUnitIds: [],
  };
};
