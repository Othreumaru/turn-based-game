import { Effect, Game, Team, Unit } from '../types';
export declare const SLOTS: Team;
export declare const getInitialState: () => Effect[];
export declare const getGame: (effects: Effect[]) => Game;
export declare const nextTurn: (game: Game) => Game;
export declare const attackUnit: (game: Game) => (sourceId: string) => (targetId: string) => (effects: Effect[]) => Effect[];
export declare const unitIsAlive: (unit: Unit) => boolean;
export declare const unitIsDead: (unit: Unit) => boolean;
export declare const takeDefensivePosition: (source: Unit, game: Game) => Game;
