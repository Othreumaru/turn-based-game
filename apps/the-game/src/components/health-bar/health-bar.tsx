import * as R from 'ramda';
import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { Rect } from '../rect';

interface Props {
  x?: number;
  y?: number;
  hp: number;
  maxHp: number;
  width: number;
  height: number;
  spacerThickness?: number;
}

export const HealthBar = React.memo<Props>(
  ({ x, y, hp, maxHp, width, height, spacerThickness = 1 }) => {
    const segmentWidth = width / maxHp;
    return (
      <Container x={x || 0} y={y || 0}>
        {R.range(0, maxHp).map((val) => {
          return (
            <Rect
              key={`${val}`}
              x={val * segmentWidth}
              y={0}
              width={segmentWidth - spacerThickness}
              height={height}
              fillColor={val < hp ? 0x00ff00 : 0xff0000}
            />
          );
        })}
      </Container>
    );
  }
);
