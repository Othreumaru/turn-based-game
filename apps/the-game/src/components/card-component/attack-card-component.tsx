import * as React from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import { AttackAction } from '../../features/units';
import { CommonProps } from './types';
import { AXE_GRAPHICS, getUiTexture } from '../resources';
import { scaleWidthHeight, CENTER_X_CENTER_Y_ANCHOR } from '../../utils';

interface Props extends CommonProps {
  card: AttackAction;
}

export const AttackCardComponent = React.memo<Props>(({ x, y, width, height, card }) => {
  const texture = getUiTexture(AXE_GRAPHICS);
  return (
    <Container x={x || 0} y={y || 0}>
      <Text
        x={3 * (width / 8)}
        y={height / 2}
        anchor={CENTER_X_CENTER_Y_ANCHOR}
        text={`${card.dmg}`}
        style={{
          fontSize: 64,
        }}
      />
      <Sprite
        x={5 * (width / 8)}
        y={height / 2}
        anchor={CENTER_X_CENTER_Y_ANCHOR}
        texture={texture}
        {...scaleWidthHeight(texture, width / 3)}
      />
    </Container>
  );
});
