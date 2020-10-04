export interface TweenAnimation {
    duration: number;
    loop: boolean;
    pingPong: boolean;
    keyframes: {
        from: {
            [key: string]: number;
        };
        to: {
            [key: string]: number;
        };
        [key: string]: {
            [key: string]: number;
        };
    };
}
