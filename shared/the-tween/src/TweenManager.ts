import Tween from './Tween';
import { TweenAnimation } from './types';

export default class TweenManager {
  private _tweensToDelete: Tween[] = [];
  private _last: number = 0;

  tweens: Tween[] = [];

  constructor() {}

  update(delta?: number) {
    let deltaMS;
    if (!delta && delta !== 0) {
      deltaMS = this._getDeltaMS();
      delta = deltaMS / 1000;
    } else {
      deltaMS = delta * 1000;
    }

    for (let i = 0; i < this.tweens.length; i++) {
      let tween = this.tweens[i];
      if (tween.active) {
        tween.update(delta, deltaMS);
      }
      if (tween.isEnded && tween.expire) {
        tween.remove();
      }
    }

    if (this._tweensToDelete.length) {
      for (let i = 0; i < this._tweensToDelete.length; i++) this._remove(this._tweensToDelete[i]);
      this._tweensToDelete.length = 0;
    }
  }

  getTweensForTarget(target: any) {
    let tweens = [];
    for (let i = 0; i < this.tweens.length; i++) {
      if (this.tweens[i].target === target) tweens.push(this.tweens[i]);
    }

    return tweens;
  }

  createTween(tweenAnimation: TweenAnimation) {
    return new Tween(tweenAnimation, this);
  }

  addTween(tween: Tween) {
    tween.manager = this;
    this.tweens.push(tween);
  }

  removeTween(tween: Tween) {
    this._tweensToDelete.push(tween);
  }

  _remove(tween: Tween) {
    let index = this.tweens.indexOf(tween);
    if (index !== -1) this.tweens.splice(index, 1);
  }

  _getDeltaMS() {
    if (this._last === 0) this._last = Date.now();
    let now = Date.now();
    let deltaMS = now - this._last;
    this._last = now;
    return deltaMS;
  }
}
