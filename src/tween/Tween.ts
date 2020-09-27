import * as PIXI from 'pixi.js';
import Easing from './Easing';
import TweenManager from './TweenManager';
import TweenPath from './TweenPath';

export default class Tween extends PIXI.utils.EventEmitter {
  private _chainTween: Tween | null = null;
  private _to: any = null;
  private _from: any = null;
  private _delayTime = 0;
  private _elapsedTime = 0;
  private _repeat = 0;
  private _pingPong = false;

  target: any;
  manager: TweenManager | null = null;
  active: boolean = false;
  time: number = 0;
  easing = Easing.linear();
  expire: boolean = false;
  repeat = 0;
  loop = false;
  delay = 0;
  pingPong = false;
  isStarted = false;
  isEnded = false;
  path: TweenPath | null = null;
  pathReverse = false;
  pathFrom = 0;
  pathTo = 0;

  constructor(target: any, manager: TweenManager | null = null) {
    super();
    this.target = target;
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
    if (!tween) tween = new Tween(this.target);
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

  to(data: any) {
    this._to = data;
    return this;
  }

  from(data: any) {
    this.from = data;
    return this;
  }

  remove() {
    if (!this.manager) return this;
    this.manager.removeTween(this);
    return this;
  }

  clear() {
    this.time = 0;
    this.active = false;
    this.easing = Easing.linear();
    this.expire = false;
    this.repeat = 0;
    this.loop = false;
    this.delay = 0;
    this.pingPong = false;
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

    if (this.pingPong && this._pingPong) {
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
      this._parseData();
      this.isStarted = true;
      this.emit('start');
    }

    let time = this.pingPong ? this.time / 2 : this.time;
    if (time > this._elapsedTime) {
      let t = this._elapsedTime + deltaMS;
      let ended = t >= time;

      this._elapsedTime = ended ? time : t;
      this._apply(time);

      let realElapsed = this._pingPong ? time + this._elapsedTime : this._elapsedTime;
      this.emit('update', realElapsed);

      if (ended) {
        if (this.pingPong && !this._pingPong) {
          this._pingPong = true;
          _to = this._to;
          _from = this._from;
          this._from = _to;
          this._to = _from;

          if (this.path) {
            _to = this.pathTo;
            _from = this.pathFrom;
            this.pathTo = _from;
            this.pathFrom = _to;
          }

          this.emit('pingpong');
          this._elapsedTime = 0;
          return;
        }

        if (this.loop || this.repeat > this._repeat) {
          this._repeat++;
          this.emit('repeat', this._repeat);
          this._elapsedTime = 0;

          if (this.pingPong && this._pingPong) {
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

  _parseData() {
    if (this.isStarted) return;

    if (!this._from) this._from = {};
    _parseRecursiveData(this._to, this._from, this.target);

    if (this.path) {
      let distance = this.path.totalDistance();
      if (this.pathReverse) {
        this.pathFrom = distance;
        this.pathTo = 0;
      } else {
        this.pathFrom = 0;
        this.pathTo = distance;
      }
    }
  }

  _apply(time: number) {
    _recursiveApplyTween(this._to, this._from, this.target, time, this._elapsedTime, this.easing);

    if (this.path) {
      let time = this.pingPong ? this.time / 2 : this.time;
      let b = this.pathFrom;
      let c = this.pathTo - this.pathFrom;
      let d = time;
      let t = this._elapsedTime / d;

      let distance = b + c * this.easing(t);
      let pos = this.path.getPointAtDistance(distance);
      this.target.position.set(pos.x, pos.y);
    }
  }

  _canUpdate() {
    return this.time && this.active && this.target;
  }
}

function _recursiveApplyTween(
  to: { [x: string]: any },
  from: { [x: string]: any },
  target: { [x: string]: any },
  time: number,
  elapsed: number,
  easing: { (t: number): number; (arg0: number): number }
) {
  for (let k in to) {
    if (!_isObject(to[k])) {
      let b = from[k];
      let c = to[k] - from[k];
      let d = time;
      let t = elapsed / d;
      target[k] = b + c * easing(t);
    } else {
      _recursiveApplyTween(to[k], from[k], target[k], time, elapsed, easing);
    }
  }
}

function _parseRecursiveData(
  to: { [x: string]: any },
  from: { [x: string]: any },
  target: { [x: string]: any }
) {
  for (let k in to) {
    if (from[k] !== 0 && !from[k]) {
      if (_isObject(target[k])) {
        from[k] = JSON.parse(JSON.stringify(target[k]));
        _parseRecursiveData(to[k], from[k], target[k]);
      } else {
        from[k] = target[k];
      }
    }
  }
}

function _isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
