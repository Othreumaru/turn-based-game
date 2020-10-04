import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { Rect } from '../rect';
export const UnitComponent = ({ x, y, width, height, unit: { stats, name } }) => {
    return (React.createElement(Container, { x: x || 0, y: y || 0 },
        React.createElement(Rect, { width: width, height: height, fillColor: 0x0000ff }),
        React.createElement(Rect, { y: height * 0.8, width: width, height: height * 0.2, fillColor: 0xffffff }),
        React.createElement(Rect, { y: height * 0.8 * (stats.hp.current / stats.hp.max), width: width, height: height * 0.8 * (1 - stats.hp.current / stats.hp.max), fillColor: 0xff0000 }),
        React.createElement(Text, { text: name }),
        React.createElement(Text, { x: width * 0.5, y: height * 0.8, text: stats.hp.current + '/' + stats.hp.max, anchor: new PIXI.Point(0.5, 0), style: { fontSize: 18, fontWeight: 'bold' } })));
};
//# sourceMappingURL=unit-component.js.map