declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*img' {
  const value: any;
  export = value;
}

interface Dictionary<T> {
  [key: string]: T;
}
