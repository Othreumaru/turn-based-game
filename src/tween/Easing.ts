const Easing = {
  linear: () => (t: number) => t,

  inQuad: () => (t: number) => t * t,

  outQuad: () => (t: number) => t * (2 - t),

  inOutQuad: () => (t: number) => {
    t *= 2;
    if (t < 1) return 0.5 * t * t;
    return -0.5 * (--t * (t - 2) - 1);
  },

  inCubic: () => (t: number) => t * t * t,

  outCubic: () => (t: number) => --t * t * t + 1,

  inOutCubic: () => (t: number) => {
    t *= 2;
    if (t < 1) return 0.5 * t * t * t;
    t -= 2;
    return 0.5 * (t * t * t + 2);
  },

  inQuart: () => (t: number) => t * t * t * t,

  outQuart: () => (t: number) => 1 - --t * t * t * t,

  inOutQuart: () => (t: number) => {
    t *= 2;
    if (t < 1) return 0.5 * t * t * t * t;
    t -= 2;
    return -0.5 * (t * t * t * t - 2);
  },

  inQuint: () => (t: number) => t * t * t * t * t,

  outQuint: () => (t: number) => --t * t * t * t * t + 1,

  inOutQuint: () => (t: number) => {
    t *= 2;
    if (t < 1) return 0.5 * t * t * t * t * t;
    t -= 2;
    return 0.5 * (t * t * t * t * t + 2);
  },

  inSine: () => (t: number) => 1 - Math.cos((t * Math.PI) / 2),

  outSine: () => (t: number) => Math.sin((t * Math.PI) / 2),

  inOutSine: () => (t: number) => 0.5 * (1 - Math.cos(Math.PI * t)),

  inExpo: () => (t: number) => (t === 0 ? 0 : Math.pow(1024, t - 1)),

  outExpo: () => (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

  inOutExpo: () => (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    t *= 2;
    if (t < 1) return 0.5 * Math.pow(1024, t - 1);
    return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
  },

  inCirc: () => (t: number) => 1 - Math.sqrt(1 - t * t),

  outCirc: () => (t: number) => Math.sqrt(1 - --t * t),

  inOutCirc: () => (t: number) => {
    t *= 2;
    if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t - 2) * (t - 2)) + 1);
  },

  inElastic: (a = 0.1, p = 0.4) => (t: number) => {
    let s;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    return -(a * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - s) * (2 * Math.PI)) / p));
  },

  outElastic: (a = 0.1, p = 0.4) => (t: number) => {
    let s;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    return a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
  },

  inOutElastic: (a = 0.1, p = 0.4) => (t: number) => {
    let s;
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    t *= 2;
    if (t < 1)
      return -0.5 * (a * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - s) * (2 * Math.PI)) / p));
    return a * Math.pow(2, -10 * (t - 1)) * Math.sin(((t - 1 - s) * (2 * Math.PI)) / p) * 0.5 + 1;
  },

  inBack: (v: number) => (t: number) => {
    let s = v || 1.70158;
    return t * t * ((s + 1) * t - s);
  },

  outBack: (v: number) => (t: number) => {
    let s = v || 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
  },

  inOutBack: (v: any) => (t: number) => {
    let s = (v || 1.70158) * 1.525;
    t *= 2;
    if (t < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t - 2) * (t - 2) * ((s + 1) * (t - 2) + s) + 2);
  },

  inBounce: () => (t: number) => 1 - Easing.outBounce()(1 - t),

  outBounce: () => (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      t = t - 1.5 / 2.75;
      return 7.5625 * t * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      t = t - 2.25 / 2.75;
      return 7.5625 * t * t + 0.9375;
    } else {
      t -= 2.625 / 2.75;
      return 7.5625 * t * t + 0.984375;
    }
  },

  inOutBounce: () => (t: number) => {
    if (t < 0.5) return Easing.inBounce()(t * 2) * 0.5;
    return Easing.outBounce()(t * 2 - 1) * 0.5 + 0.5;
  },

  customArray: (arr: any[]) => {
    if (!arr) return Easing.linear();
    return (t: number) => {
      //todo: convert array => ease
      return t;
    };
  },
};

export default Easing;
