import * as React from 'react';
import { Team, SlotIds } from '../types';
export interface ChildrenCallbackData {
    slotId: SlotIds;
    x: number;
    y: number;
    width: number;
    height: number;
}
interface Props {
    x: number;
    y: number;
    slots: Team;
    orientation: 'left' | 'right';
    anchor: PIXI.Point;
    children: (data: ChildrenCallbackData) => any;
}
export declare const TeamContainer: React.FC<Props>;
export {};
