import * as R from 'ramda';
import { getRandomInt, rollChance } from '../utils/utils';
import { createGoblin, createHealer, createOrc, createWarrior } from './create-units';
const completedTurnUnitIdsLens = R.lensProp('completedTurnUnitIds');
const currentTurnUnitIdLens = R.lensProp('currentTurnUnitId');
const upcomingTurnUnitIdsLens = R.lensProp('upcomingTurnUnitIds');
const sortUnits = (units) => {
    return units.slice().sort((u1, u2) => u2.stats.initiative.current - u1.stats.initiative.current);
};
const removeDefensiveFromUnit = (unitId) => {
    return R.over(R.lensPath(['units', unitId, 'tags']), R.reject(R.equals('defensive')));
};
export const SLOTS = {
    slot00: { id: 'slot00', column: 0, row: 0 },
    slot01: { id: 'slot01', column: 0, row: 1 },
    slot02: { id: 'slot02', column: 0, row: 2 },
    slot10: { id: 'slot10', column: 1, row: 0 },
    slot11: { id: 'slot11', column: 1, row: 1 },
    slot12: { id: 'slot12', column: 1, row: 2 },
};
export const getInitialState = () => {
    const units = [
        createWarrior('slot10'),
        createWarrior('slot11'),
        createWarrior('slot12'),
        createHealer('slot01'),
        createOrc('slot11'),
        createGoblin('slot01'),
    ];
    return units.map((unit) => ({
        type: 'spawn-effect',
        unit,
    }));
};
export const getGame = (effects) => {
    const initial = {
        units: {},
        currentTurnUnitId: '',
        completedTurnUnitIds: [],
        upcomingTurnUnitIds: [],
        effects: [],
    };
    return effects.reduce((acc, effect) => {
        switch (effect.type) {
            case 'spawn-effect': {
                const unitIds = sortUnits([
                    ...acc.upcomingTurnUnitIds.map((unitId) => acc.units[unitId]),
                    effect.unit,
                ]).map((u) => u.id);
                return {
                    ...acc,
                    units: {
                        ...acc.units,
                        [effect.unit.id]: effect.unit,
                    },
                    upcomingTurnUnitIds: acc.currentTurnUnitId === '' ? unitIds.slice(1) : unitIds,
                    currentTurnUnitId: acc.currentTurnUnitId === '' ? unitIds[0] : acc.currentTurnUnitId,
                };
            }
            case 'dmg-effect': {
                const newUnits = R.pipe(R.map((unit) => {
                    const unitEffect = effect.targets.find((e) => e.unitId === unit.id);
                    if (unitEffect) {
                        return R.over(R.lensPath(['stats', 'hp', 'current']), R.add(-unitEffect.dmgAmount), unit);
                    }
                    return unit;
                }))(acc.units);
                return {
                    ...acc,
                    units: newUnits,
                    upcomingTurnUnitIds: acc.upcomingTurnUnitIds.filter((id) => newUnits[id].stats.hp.current > 0),
                };
            }
            case 'end-turn-effect': {
                return nextTurn(acc);
            }
        }
        return acc;
    }, initial);
};
export const nextTurn = (game) => {
    if (game.upcomingTurnUnitIds.length) {
        const [current, ...rest] = game.upcomingTurnUnitIds;
        return R.pipe(removeDefensiveFromUnit(current), R.over(completedTurnUnitIdsLens, R.append(game.currentTurnUnitId)), R.set(currentTurnUnitIdLens, current), R.set(upcomingTurnUnitIdsLens, rest))(game);
    }
    const initiativeSortedUnitIds = R.pipe(R.values, sortUnits, R.map(R.prop('id')))(game.units);
    return R.pipe(removeDefensiveFromUnit(R.head(initiativeSortedUnitIds)), R.set(completedTurnUnitIdsLens, []), R.set(currentTurnUnitIdLens, R.head(initiativeSortedUnitIds)), R.set(upcomingTurnUnitIdsLens, R.drop(1, initiativeSortedUnitIds)))(game);
};
export const attackUnit = (game) => (sourceId) => (targetId) => (effects) => {
    const sourceUnit = game.units[sourceId];
    const action = sourceUnit.action;
    if (action.type === 'attack-action') {
        return R.ifElse(rollChance(sourceUnit.stats.hitChance.current), R.ifElse(rollChance(sourceUnit.stats.critChance.current), R.append({
            type: 'dmg-effect',
            sourceUnitId: sourceId,
            targets: [
                {
                    unitId: targetId,
                    isCrit: true,
                    dmgAmount: getRandomInt(action.minDmg, action.maxDmg) * sourceUnit.stats.critMult.current,
                },
            ],
        }), R.append({
            type: 'dmg-effect',
            sourceUnitId: sourceId,
            targets: [
                {
                    unitId: targetId,
                    isCrit: false,
                    dmgAmount: getRandomInt(action.minDmg, action.maxDmg),
                },
            ],
        })), R.append({
            type: 'miss-effect',
            sourceUnitId: sourceId,
            targetUnitIds: [targetId],
        }))(effects);
    }
    else {
        return R.ifElse(rollChance(sourceUnit.stats.hitChance.current), R.ifElse(rollChance(sourceUnit.stats.critChance.current), R.append({
            type: 'heal-effect',
            sourceUnitId: sourceId,
            targets: [
                {
                    unitId: targetId,
                    isCrit: true,
                    healAmount: getRandomInt(action.minHeal, action.maxHeal) * sourceUnit.stats.critMult.current,
                },
            ],
        }), R.append({
            type: 'heal-effect',
            sourceUnitId: sourceId,
            targets: [
                {
                    unitId: targetId,
                    isCrit: false,
                    healAmount: getRandomInt(action.minHeal, action.maxHeal),
                },
            ],
        })), R.append({
            type: 'miss-effect',
            sourceUnitId: sourceId,
            targetUnitIds: [targetId],
        }))(effects);
    }
};
export const unitIsAlive = (unit) => unit.stats.hp.current > 0;
export const unitIsDead = (unit) => !unitIsAlive(unit);
export const takeDefensivePosition = (source, game) => {
    return R.pipe(nextTurn, R.over(R.lensPath(['units', source.id, 'tags']), (tags) => [...tags, 'defensive']))(game);
};
//# sourceMappingURL=game-logic.js.map