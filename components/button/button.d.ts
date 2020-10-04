import * as React from 'react';
interface Props {
    x?: number;
    y?: number;
    width: number;
    height: number;
    label: string;
    onClick: () => void;
}
export declare const Button: React.FC<Props>;
export {};
