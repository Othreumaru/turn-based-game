declare module '*.png' {
  const value: any;
  export = value;
}

declare module 'pixi-tween' {
  const value: any;
  export = value;
}

interface Dictionary<T> {
  [key: string]: T;
}
