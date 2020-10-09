import * as PIXI from 'pixi.js';
import Easing from './Easing';
import TweenManager from './TweenManager';
import TweenPath from './TweenPath';
import { TweenAnimation } from './types';

export default class Tween extends PIXI.utils.EventEmitter {
  private _chainTween: Tween | null = null;
  private _to: any = null;
  private _from: any = null;
  private _interpolators: any = null;
  private _delayTime = 0;
  private _elapsedTime = 0;
  private _repeat = 0;
  private _pingPong = false;

  animation: TweenAnimation;
  target: any = {};
  manager: TweenManager | null = null;
  active: boolean = false;
  easing = Easing.linear();
  expire: boolean = false;
  repeat = 0;
  delay = 0;
  isStarted = false;
  isEnded = false;
  path: TweenPath | null = null;
  pathReverse = false;
  pathFrom = 0;
  pathTo = 0;

  constructor(animation: TweenAnimation, manager: TweenManager | null = null) {
    super();
    this.animation = animation;
    if (manager) this.addTo(manager);
    this.clear();
  }

  addTo(manager: TweenManager | null) {
    this.manager = manager;
    if (this.manager) {
      this.manager.addTween(this);
    }
    return this;
  }

  chain(tween: Tween) {
    this._chainTween = tween;
    return tween;
  }

  start() {
    this.active = true;
    return this;
  }

  stop() {
    this.active = false;
    this.emit('stop');
    return this;
  }

  interpolators(data: any) {
    this._interpolators = data;
    return this;
  }

  remove() {
    if (!this.manager) return this;
    this.manager.removeTween(this);
    return this;
  }

  clear() {
    this.active = false;
    this.easing = Easing.linear();
    this.expire = false;
    this.repeat = 0;
    this.delay = 0;
    this.isStarted = false;
    this.isEnded = false;

    this._to = null;
    this._from = null;
    this._delayTime = 0;
    this._elapsedTime = 0;
    this._repeat = 0;
    this._pingPong = false;

    this._chainTween = null;

    this.path = null;
    this.pathReverse = false;
    this.pathFrom = 0;
    this.pathTo = 0;
  }

  reset() {
    this._elapsedTime = 0;
    this._repeat = 0;
    this._delayTime = 0;
    this.isStarted = false;
    this.isEnded = false;

    if (this.animation.pingPong && this._pingPong) {
      let _to = this._to;
      let _from = this._from;
      this._to = _from;
      this._from = _to;

      this._pingPong = false;
    }

    return this;
  }

  update(delta: number, deltaMS: number) {
    if (!this._canUpdate() && (this._to || this.path)) return;
    let _to, _from;
    if (this.delay > this._delayTime) {
      this._delayTime += deltaMS;
      return;
    }

    if (!this.isStarted) {
      // this._parseData();
      this.isStarted = true;
      this.emit('start');
    }

    let time = this.animation.pingPong ? this.animation.duration / 2 : this.animation.duration;
    if (time > this._elapsedTime) {
      let t = this._elapsedTime + deltaMS;
      let ended = t >= time;

      this._elapsedTime = ended ? time : t;
      this._apply(time);

      let realElapsed = this._pingPong ? time + this._elapsedTime : this._elapsedTime;
      this.emit('update', realElapsed, this.target);

      if (ended) {
        if (this.animation.pingPong && !this._pingPong) {
          this._pingPong = true;

          this.emit('pingpong');
          this._elapsedTime = 0;
          return;
        }

        if (this.animation.loop || this.repeat > this._repeat) {
          this._repeat++;
          this.emit('repeat', this._repeat);
          this._elapsedTime = 0;

          if (this.animation.pingPong && this._pingPong) {
            _to = this._to;
            _from = this._from;
            this._to = _from;
            this._from = _to;

            if (this.path) {
              _to = this.pathTo;
              _from = this.pathFrom;
              this.pathTo = _from;
              this.pathFrom = _to;
            }

            this._pingPong = false;
          }
          return;
        }

        this.isEnded = true;
        this.active = false;
        this.emit('end');

        if (this._chainTween) {
          this._chainTween.addTo(this.manager);
          this._chainTween.start();
        }
      }
      return;
    }
  }

  _apply(time: number) {
    _recursiveApplyTween(
      this._pingPong ? this.animation.keyframes.from : this.animation.keyframes.to,
      this._pingPong ? this.animation.keyframes.to : this.animation.keyframes.from,
      this._interpolators,
      this.target,
      time,
      this._elapsedTime,
      this.easing
    );
  }

  _canUpdate() {
    return this.animation.duration && this.active && this.target;
  }
}

function _recursiveApplyTween(
  to: { [x: string]: any },
  from: { [x: string]: any },
  interpolators: { [x: string]: any } | undefined,
  target: { [x: string]: any },
  time: number,
  elapsed: number,
  easing: { (t: number): number; (arg0: number): number }
) {
  for (let k in to) {
    if (!_isObject(to[k])) {
      if (interpolators && interpolators[k]) {
        target[k] = interpolators[k](from[k], to[k], easing(elapsed / time));
      } else {
        let b = from[k];
        let c = to[k] - from[k];
        let t = elapsed / time;
        target[k] = b + c * easing(t);
      }
    } else {
      if (!target[k]) {
        target[k] = {};
      }
      _recursiveApplyTween(
        to[k],
        from[k],
        interpolators ? interpolators[k] : undefined,
        target[k],
        time,
        elapsed,
        easing
      );
    }
  }
}

function _isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
