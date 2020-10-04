import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
class RectGraphics extends PIXI.Graphics {
    constructor(geometry) {
        super(geometry);
    }
    startAnimation(tweenManager, animation) {
        if (this.__tween) {
            this.__tween.stop();
            this.__tween.remove();
        }
        this.__tween = tweenManager.createTween(this);
        this.__tween.time = animation.duration;
        this.__tween.loop = animation.loop;
        this.__tween.pingPong = animation.pingPong;
        this.__tween.from(animation.keyframes.from);
        this.__tween.to(animation.keyframes.to);
        this.__tween.interpolators({
            lineColor: (from, to, t) => {
                const fromRGB = [(from & 0xff0000) >> 16, (from & 0x00ff00) >> 8, from & 0x0000ff];
                const toRGB = [(to & 0xff0000) >> 16, (to & 0x00ff00) >> 8, to & 0x0000ff];
                const result = fromRGB.map((fromRGB, index) => Math.floor(fromRGB + (toRGB[index] - fromRGB) * t));
                return (result[0] << 16) + (result[1] << 8) + result[2];
            },
        });
        this.__tween.start();
    }
    _render(renderer) {
        super._render(renderer);
        this.clear();
        if (this.lineColor || this.lineWidth) {
            this.lineStyle(this.lineWidth || 1, this.lineColor || 0x00ff00);
        }
        if (this.fillColor) {
            this.beginFill(this.fillColor);
        }
        this.drawRect(0, 0, this._width, this._height);
        if (this.fillColor) {
            this.endFill();
        }
    }
}
const TYPE = 'Rect';
export const behavior = {
    customDisplayObject: () => new RectGraphics(),
    customApplyProps: function (instance, oldProps, newProps) {
        if (newProps.tweenManager && newProps.animation && oldProps.animation !== newProps.animation) {
            instance.startAnimation(newProps.tweenManager, newProps.animation);
        }
        this.applyDisplayObjectProps(oldProps, newProps);
    },
};
export const Rect = CustomPIXIComponent(behavior, TYPE);
//# sourceMappingURL=rect.js.map