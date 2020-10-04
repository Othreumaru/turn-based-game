import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
const TYPE = 'DroppableContainer';
const behavior = {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: function (instance, oldProps, newProps) {
        instance.__onDrop = newProps.onDrop;
        instance.__acceptTags = newProps.acceptTags || [];
        const { width, height } = newProps;
        instance.clear();
        instance.beginFill(newProps.debugColor || 0x00ff00);
        instance.drawRect(0, 0, width, height);
        instance.endFill();
        this.applyDisplayObjectProps(oldProps, newProps);
    },
};
export const DroppableContainer = CustomPIXIComponent(behavior, TYPE);
//# sourceMappingURL=droppable-container.js.map