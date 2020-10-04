import * as React from 'react';
import { Container, Stage, Text } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import * as PIXI from 'pixi.js';
import { attackUnit, getGame, getInitialState, SLOTS, unitIsDead } from './game-logic';
import { useState } from 'react';
import { TeamContainer } from '../team-container/team-container';
import { UnitComponent } from '../unit-component';
import { Rect } from '../rect';
import { Button } from '../button/button';
import * as R from 'ramda';
import { EffectContainer } from '../effect-container';
const CURRENT_UNIT_Y_OFFSET = 10;
const QUEUE_UNIT_SIZE = 80;
const QUEUE_UNIT_OFFSET = 10;
const TEAM_SLOT_X_OFFSET = 10;
const PLAYER_TEAM_ANCHOR = new PIXI.Point(0, 0.5);
const ENEMY_TEAM_ANCHOR = new PIXI.Point(1, 0.5);
const MOUSE_OVER_LINE_COLOR = 0xff0000;
const MIDDLE_ANCHOR = new PIXI.Point(0.5, 0.5);
const SELECTED_UNIT_BORDER_ANIMATION = {
    duration: 750,
    loop: true,
    pingPong: true,
    keyframes: {
        from: {
            lineColor: 0x72bcd4,
        },
        to: {
            lineColor: 0xc1e1ec,
        },
    },
};
const getTeamConfig = (viewportWidth) => [
    { team: 'player', x: TEAM_SLOT_X_OFFSET, orientation: 'right', anchor: PLAYER_TEAM_ANCHOR },
    {
        team: 'enemy',
        x: viewportWidth - TEAM_SLOT_X_OFFSET,
        orientation: 'left',
        anchor: ENEMY_TEAM_ANCHOR,
    },
];
const StageComponent = ({ app, tweenManager, width: viewportWidth, height: viewportHeight, }) => {
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    const [state, setState] = useState(getInitialState());
    const [mouseOverUnitId, setMouseOverUnitId] = useState();
    const gameState = getGame(state);
    const onMouseOver = (unitId) => () => {
        setMouseOverUnitId(unitId);
    };
    const onMouseOut = () => {
        setMouseOverUnitId(undefined);
    };
    const unitClick = (unitId) => () => {
        setState(attackUnit(gameState)(gameState.currentTurnUnitId)(unitId));
    };
    return (React.createElement(Stage, { app: app },
        React.createElement(Container, { x: viewportCenterX, y: CURRENT_UNIT_Y_OFFSET, interactive: true, mouseover: onMouseOver(gameState.currentTurnUnitId), mouseout: onMouseOut },
            React.createElement(UnitComponent, { height: QUEUE_UNIT_SIZE, width: QUEUE_UNIT_SIZE, unit: gameState.units[gameState.currentTurnUnitId] }),
            React.createElement(Rect, { width: QUEUE_UNIT_SIZE, height: QUEUE_UNIT_SIZE, lineColor: MOUSE_OVER_LINE_COLOR, lineWidth: 3, alpha: mouseOverUnitId === gameState.currentTurnUnitId ? 1 : 0 })),
        gameState.upcomingTurnUnitIds
            .map((unitId) => gameState.units[unitId])
            .map((unit, index) => (React.createElement(Container, { key: unit.id, x: viewportCenterX + 20 + (index + 1) * (QUEUE_UNIT_SIZE + QUEUE_UNIT_OFFSET), y: CURRENT_UNIT_Y_OFFSET, interactive: true, mouseover: onMouseOver(unit.id), mouseout: onMouseOut },
            React.createElement(UnitComponent, { key: unit.id, height: QUEUE_UNIT_SIZE, width: QUEUE_UNIT_SIZE, unit: unit }),
            React.createElement(Rect, { width: QUEUE_UNIT_SIZE, height: QUEUE_UNIT_SIZE, lineColor: MOUSE_OVER_LINE_COLOR, lineWidth: 3, alpha: mouseOverUnitId === unit.id ? 1 : 0 })))),
        getTeamConfig(viewportWidth).map(({ x, orientation, team, anchor }) => {
            return (React.createElement(TeamContainer, { key: team, x: x, y: viewportCenterY, slots: SLOTS, orientation: orientation, anchor: anchor }, ({ slotId, x, y, width, height }) => {
                const unit = Object.values(gameState.units)
                    .filter((u) => u.team === team)
                    .find((u) => u.slotId === slotId);
                return unit ? (unitIsDead(unit) ? (React.createElement(Container, { key: slotId, x: x, y: y, width: width, height: height },
                    React.createElement(Rect, { width: width, height: height, fillColor: 0xeeeeee }),
                    React.createElement(Container, { x: width / 2, y: height / 2 },
                        React.createElement(Text, { text: 'DEAD', anchor: MIDDLE_ANCHOR })))) : (React.createElement(Container, { key: slotId, x: x, y: y, width: width, height: height, interactive: true, mouseover: onMouseOver(unit.id), mouseout: onMouseOut, click: unitClick(unit.id) },
                    React.createElement(UnitComponent, { width: width, height: height, unit: unit }),
                    gameState.currentTurnUnitId === unit.id && (React.createElement(Rect, { width: width, height: height, lineWidth: 6, tweenManager: tweenManager, animation: SELECTED_UNIT_BORDER_ANIMATION })),
                    React.createElement(Rect, { width: width, height: height, lineColor: MOUSE_OVER_LINE_COLOR, lineWidth: 3, alpha: mouseOverUnitId === unit.id ? 1 : 0 }),
                    React.createElement(EffectContainer, { tweenManager: tweenManager, effects: state, initialPropValues: { alpha: 0 }, triggerOn: (e) => e.type === 'miss-effect' && e.targetUnitIds.includes(unit.id), onEnter: [
                            { prop: 'alpha', toValue: 1, time: 500 },
                            { prop: 'alpha', toValue: 1, time: 500 },
                            { prop: 'alpha', toValue: 0, time: 500 },
                        ] }, () => (React.createElement(React.Fragment, null,
                        React.createElement(Rect, { width: width, height: height, fillColor: 0xffffff, alpha: 0.4 }),
                        React.createElement(Container, { x: width / 2, y: height / 2 },
                            React.createElement(Text, { text: 'MISS', anchor: MIDDLE_ANCHOR }))))),
                    React.createElement(EffectContainer, { tweenManager: tweenManager, effects: state, initialPropValues: { alpha: 0 }, triggerOn: (e) => e.type === 'dmg-effect' &&
                            e.targets.find((t) => t.unitId === unit.id) !== undefined, onEnter: [
                            { prop: 'alpha', toValue: 1, time: 200 },
                            { prop: 'alpha', toValue: 1, time: 700 },
                            { prop: 'alpha', toValue: 0, time: 200 },
                        ] }, (effect) => {
                        const e = effect.targets.find((t) => t.unitId === unit.id);
                        return (React.createElement(React.Fragment, null,
                            React.createElement(Rect, { width: width, height: height, fillColor: 0xff0000, alpha: 0.4 }),
                            React.createElement(Container, { x: width / 2, y: height / 2 },
                                React.createElement(Text, { text: e ? `${e.dmgAmount}` : '?', style: { fill: 0xffffff, fontSize: e ? (e.isCrit ? 50 : 24) : 10 }, anchor: MIDDLE_ANCHOR }))));
                    })))) : null;
            }));
        }),
        React.createElement(Button, { x: 800, y: 900, width: 120, height: 30, label: 'next-turn', onClick: () => {
                setState(R.append({ type: 'end-turn-effect' }));
            } })));
};
export const MainStage = hot(StageComponent);
//# sourceMappingURL=main-stage.js.map