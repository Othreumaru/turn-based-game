import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { Rect } from '../rect';
export const Button = ({ x, y, width, height, label, onClick }) => {
    return (React.createElement(Container, { x: x || 0, y: y || 0, width: width, height: height, interactive: true, click: onClick },
        React.createElement(Rect, { width: width, height: height, lineColor: 0xff0000 }),
        React.createElement(Text, { text: label })));
};
//# sourceMappingURL=button.js.map