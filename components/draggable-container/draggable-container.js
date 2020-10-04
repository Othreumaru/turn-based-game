import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
const TYPE = 'DraggableContainer';
const behavior = {
    customDisplayObject: ({ app }) => {
        const instance = new PIXI.Container();
        instance.__notifyContainerAt = (position, children = app.stage.children) => {
            let onDropToReturn = undefined;
            children.forEach((child) => {
                if (child.__isDragged) {
                    return;
                }
                const dropContainer = child;
                const hasOnDrop = dropContainer.__onDrop !== undefined;
                const isInBounds = dropContainer.getBounds().contains(position.x, position.y);
                const matchTags = instance.__tags.every((tag) => (dropContainer.__acceptTags || []).includes(tag));
                if (hasOnDrop && isInBounds && matchTags) {
                    onDropToReturn = dropContainer;
                }
                if (child.children) {
                    const onDropFromChildren = instance.__notifyContainerAt(position, child.children);
                    if (onDropFromChildren) {
                        onDropToReturn = onDropFromChildren;
                    }
                }
            });
            return onDropToReturn;
        };
        return instance;
    },
    customDidAttach: (instance) => {
        instance.interactive = true;
        instance.cursor = 'pointer';
        instance.zIndex = 1000;
        instance.__isDragged = false;
        let draggedObject;
        instance.__dragStart = () => {
            draggedObject = instance;
            draggedObject.zIndex = 2000;
            draggedObject.__isDragged = true;
            if (draggedObject.__onDragStart) {
                draggedObject.__onDragStart();
            }
        };
        instance.__dragEnd = (event) => {
            if (draggedObject === undefined) {
                return;
            }
            if (draggedObject.__onDragStop) {
                draggedObject.__onDragStop();
            }
            const container = instance.__notifyContainerAt(event.data.global);
            if (container) {
                container.__onDrop(draggedObject.__transferObject);
            }
            if (draggedObject.visible && !draggedObject._destroyed) {
                draggedObject.zIndex = 1000;
                draggedObject.x = draggedObject.__desiredXPos;
                draggedObject.y = draggedObject.__desiredYPos;
                draggedObject.__isDragged = false;
            }
            draggedObject = undefined;
        };
        instance.__dragMove = (e) => {
            if (draggedObject === undefined) {
                return;
            }
            draggedObject.position.x += e.data.originalEvent.movementX;
            draggedObject.position.y += e.data.originalEvent.movementY;
        };
        instance.on('mousedown', instance.__dragStart);
        instance.on('mouseup', instance.__dragEnd);
        instance.on('mousemove', instance.__dragMove);
    },
    customApplyProps: function (instance, oldProps, newProps) {
        instance.__transferObject = newProps.transferObject;
        instance.__desiredXPos = newProps.x;
        instance.__desiredYPos = newProps.y;
        instance.__onDragStart = newProps.onDragStart;
        instance.__onDragStop = newProps.onDragStop;
        instance.__tags = newProps.tags || [];
        if (newProps.scale !== undefined) {
            instance.scale = newProps.scale;
        }
        instance.x = newProps.x;
        instance.y = newProps.y;
    },
    customWillDetach: (instance) => {
        instance.off('mousedown', instance.__dragStart);
        instance.off('mouseup', instance.__dragEnd);
        instance.off('mousemove', instance.__dragMove);
    },
};
export const DraggableContainer = CustomPIXIComponent(behavior, TYPE);
//# sourceMappingURL=draggable-container.js.map