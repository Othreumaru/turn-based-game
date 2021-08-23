export interface Card {
  name: string;
  text: string[];
}

export interface CardGameState {
  hand: Card[];
  deck: Card[];
  discard: Card[];
}

const GAIN_MOVE: Card = {
  name: 'Gain Move',
  text: ['Get 1 move', 'play next card'],
};
const BETTER_GAIN_MOVE: Card = {
  name: 'Better Gain Move',
  text: ['Draw 1 card', 'Get 1 move', 'play next card'],
};
const ATTACK_INCREASE: Card = {
  name: 'Attack Increase',
  text: ['Increase attack dmg by 2', 'play next card'],
};
const ATTACK: Card = {
  name: 'Attack',
  text: ['Deal attack to single target'],
};
const BETTER_ATTACK: Card = {
  name: 'Better Attack',
  text: ['Deal attack to single target', 'play next card'],
};
const MOVE: Card = {
  name: 'Move',
  text: ['Move to a target location'],
};
// @ts-ignore
const TELEPORT: Card = {
  name: 'Teleport',
  text: ['Move target friendly unit to a location'],
};
// @ts-ignore
const PUSH: Card = {
  name: 'Push',
  text: ['Push target in line'],
};
const DRAW: Card = {
  name: 'Draw',
  text: ['Draw 1 card', 'play next card'],
};

export const cards: Card[] = [
  GAIN_MOVE,
  BETTER_GAIN_MOVE,
  ATTACK_INCREASE,
  ATTACK_INCREASE,
  ATTACK,
  ATTACK,
  BETTER_ATTACK,
  MOVE,
  MOVE,
  DRAW,
  DRAW,
];
