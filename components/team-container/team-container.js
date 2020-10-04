import * as React from 'react';
import { Rect } from '../rect';
const SLOT_SIZE = 150;
const SLOT_SPACER = 10;
const HEIGHT = SLOT_SIZE * 3 + SLOT_SPACER * 2;
const WIDTH = SLOT_SIZE * 2 + SLOT_SPACER;
const selectXPosition = (x, column, orientation, anchor) => {
    const columnOffset = orientation === 'right' ? column : 1 - column;
    return x + columnOffset * (SLOT_SIZE + SLOT_SPACER) - anchor.x * WIDTH;
};
const selectYPosition = (y, row, anchor) => {
    return y + row * (SLOT_SIZE + SLOT_SPACER) - anchor.y * HEIGHT;
};
export const TeamContainer = ({ children, x, y, orientation, slots, anchor }) => {
    return (React.createElement(React.Fragment, null,
        Object.entries(slots).map(([id, { column, row }]) => {
            return (React.createElement(Rect, { key: id, x: selectXPosition(x, column, orientation, anchor), y: selectYPosition(y, row, anchor), width: SLOT_SIZE, height: SLOT_SIZE, fillColor: 0x00ff00 }));
        }),
        typeof children === 'function'
            ? Object.values(slots)
                .map((slot) => {
                return children({
                    slotId: slot.id,
                    x: selectXPosition(x, slot.column, orientation, anchor),
                    y: selectYPosition(y, slot.row, anchor),
                    width: SLOT_SIZE,
                    height: SLOT_SIZE,
                });
            })
                .filter((c) => !!c)
            : null));
};
//# sourceMappingURL=team-container.js.map