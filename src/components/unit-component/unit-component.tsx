import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { Rect } from '../rect';
import { Unit } from '../types';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: Unit;
}

export const UnitComponent: React.FC<Props> = ({ x, y, width, height, unit: { stats, name } }) => {
  return (
    <Container x={x} y={y}>
      <Rect width={width} height={height} fill={0x0000ff} />
      <Rect y={height * 0.8} width={width} height={height * 0.2} fill={0xffffff} />
      <Rect
        y={height * 0.8 * (stats.hp.current / stats.hp.max)}
        width={width}
        height={height * 0.8 * (1 - stats.hp.current / stats.hp.max)}
        fill={0xff0000}
      />

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
