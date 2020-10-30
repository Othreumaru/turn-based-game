import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { Rect } from '../rect';
import { CENTER_X_CENTER_Y_ANCHOR } from '../../utils';
import { Animable } from '../animable';
import { TweenAnimation, TweenManager } from '@zalgoforge/the-tween';
import { Unit, unitIsDead } from '../../features/units';
import { MaskedSprite } from '../masked-sprite';
import { SHIELD_GRAPHICS, FULL_SHIELD_GRAPHICS } from '../resources';
import { UnitMarker } from './unit-marker';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  showName?: boolean;
  unit: Unit;
  tweenManager: TweenManager;
}

const MISS_FRAME_ANIMATION: TweenAnimation = {
  duration: 750,
  loop: false,
  pingPong: false,
  keyframes: {
    from: {
      alpha: 1,
    },
    to: {
      alpha: 0,
    },
  },
};

const PureUnitComponent: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  unit,
  tweenManager,
  showName = true,
}) => {
  const { stats, name, portrait } = unit;
  const hpBar = {
    x: 0,
    y: height * 0.8 * (Math.max(stats.hp.current, 0) / stats.hp.max),
    width: width,
    height: height * 0.8 * (1 - Math.max(stats.hp.current, 0) / stats.hp.max),
  };

  return (
    <Container x={x || 0} y={y || 0}>
      <Container alpha={unitIsDead(unit) ? 0 : 1}>
        <MaskedSprite
          width={width}
          height={height}
          img={unit.portrait.img}
          textureXOffset={portrait.textureXOffset}
          textureYOffset={portrait.textureYOffset}
          textureXScale={portrait.textureXScale}
          textureYScale={portrait.textureYScale}
        />
        <Rect y={height * 0.8} width={width} height={height * 0.2} fillColor={0xffffff} />
        <Rect {...hpBar} fillColor={0xff0000} />

        {showName && (
          <Text
            x={width / 2}
            y={height * 0.72}
            text={name}
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              fill: 0xffffff,
              lineJoin: 'bevel',
              miterLimit: 0,
              strokeThickness: 5,
            }}
            anchor={CENTER_X_CENTER_Y_ANCHOR}
          />
        )}
        <Text
          x={width * 0.5}
          y={height * 0.8}
          text={stats.hp.current + '/' + stats.hp.max}
          anchor={new PIXI.Point(0.5, 0)}
          style={{ fontSize: 18, fontWeight: 'bold' }}
        />
      </Container>
      <Container alpha={unitIsDead(unit) ? 1 : 0}>
        <Rect width={width} height={height} fillColor={0xeeeeee} />
        <Container x={width / 2} y={height / 2}>
          <Text text={'DEAD'} anchor={CENTER_X_CENTER_Y_ANCHOR} />
        </Container>
      </Container>
      <Animable
        width={width}
        height={height}
        fillColor={0xeeeeee}
        tweenManager={tweenManager}
        alpha={0}
        animation={MISS_FRAME_ANIMATION}
        animationTrigger={unit.stats.missCount.current}
      >
        <Container x={width / 2} y={height / 2}>
          <Text text={'MISS'} anchor={CENTER_X_CENTER_Y_ANCHOR} />
        </Container>
      </Animable>
      {stats.shield.current > 0 && (
        <UnitMarker
          width={width / 3}
          height={height / 3}
          x={width * 0.9}
          y={height * 0.7}
          uiResourceName={SHIELD_GRAPHICS}
          counter={stats.shield.current}
        />
      )}
      {stats.threat.current > 0 && (
        <UnitMarker
          width={width / 3}
          height={height / 3}
          x={width * 0.9}
          y={height * 0.1}
          uiResourceName={FULL_SHIELD_GRAPHICS}
          counter={stats.threat.current}
        />
      )}
    </Container>
  );
};

export const UnitComponent = React.memo(PureUnitComponent);
