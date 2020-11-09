import * as React from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import {
  LEFT_X_TOP_Y_ANCHOR,
  RIGHT_X_TOP_Y_ANCHOR,
  scaleWidthHeight,
  SMALL_TEXT_FONT_STYLE,
} from '../../utils';
import { COIN_GRAPHICS, getUiTexture } from '../resources';

interface Props {
  x?: number;
  y?: number;
  goldCount: number;
}

export const GoldLabelComponent = React.memo<Props>(({ x, y, goldCount }) => {
  const coinTexture = getUiTexture(COIN_GRAPHICS);
  const coinSize = scaleWidthHeight(coinTexture, 16);
  return (
    <Container x={x || 0} y={y || 0}>
      <Sprite
        x={5}
        width={coinSize.width}
        height={coinSize.height}
        texture={coinTexture}
        anchor={LEFT_X_TOP_Y_ANCHOR}
      />
      <Text text={`${goldCount}`} style={SMALL_TEXT_FONT_STYLE} anchor={RIGHT_X_TOP_Y_ANCHOR} />
    </Container>
  );
});
