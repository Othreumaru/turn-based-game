import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { Rect } from '../rect';
import { Unit } from '../types';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  unit: Unit;
}

const PureUnitComponent: React.FC<Props> = ({ x, y, width, height, unit: { stats, name } }) => {
  const hpBar = {
    x: 0,
    y: height * 0.8 * (stats.hp.current / stats.hp.max),
    width: width,
    height: height * 0.8 * (1 - stats.hp.current / stats.hp.max),
  };
  return (
    <Container x={x || 0} y={y || 0}>
      <Rect width={width} height={height} fillColor={0x0000ff} />
      <Rect y={height * 0.8} width={width} height={height * 0.2} fillColor={0xffffff} />
      <Rect {...hpBar} fillColor={0xff0000} />

      <Text text={name} />
      <Text
        x={width * 0.5}
        y={height * 0.8}
        text={stats.hp.current + '/' + stats.hp.max}
        anchor={new PIXI.Point(0.5, 0)}
        style={{ fontSize: 18, fontWeight: 'bold' }}
      />
    </Container>
  );
};

export const UnitComponent = React.memo(PureUnitComponent);
