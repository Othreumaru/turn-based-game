import * as React from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import { DefensiveStanceAction } from '../../features/units';
import { CommonProps } from './types';
import { Rect } from '../rect';
import { FULL_SHIELD_GRAPHICS, FULL_THREAT_GRAPHICS, getUiTexture } from '../resources';
import {
  BIG_TEXT_FONT_STYLE,
  CENTER_X_CENTER_Y_ANCHOR,
  RIGHT_X_CENTER_Y_ANCHOR,
  scaleWidthHeight,
} from '../../utils';

interface Props extends CommonProps {
  card: DefensiveStanceAction;
}

export const DefensiveStanceCardComponent = React.memo<Props>(({ x, y, width, height, card }) => {
  const shieldTexture = getUiTexture(FULL_SHIELD_GRAPHICS);
  const threatTexture = getUiTexture(FULL_THREAT_GRAPHICS);
  return (
    <Container x={x || 0} y={y || 0}>
      <Container x={x || 0} y={y || 0}>
        <Rect width={width} height={height} lineColor={0xffffff} lineWidth={3} />
        <Text
          x={3 * (width / 8)}
          y={3 * (height / 8)}
          anchor={RIGHT_X_CENTER_Y_ANCHOR}
          text={`+${card.shieldAmount}`}
          style={BIG_TEXT_FONT_STYLE}
        />
        <Sprite
          x={5 * (width / 8)}
          y={3 * (height / 8)}
          anchor={CENTER_X_CENTER_Y_ANCHOR}
          texture={shieldTexture}
          {...scaleWidthHeight(shieldTexture, width / 3)}
        />
        <Text
          x={3 * (width / 8)}
          y={6 * (height / 8)}
          anchor={RIGHT_X_CENTER_Y_ANCHOR}
          text={`+${card.shieldAmount}`}
          style={BIG_TEXT_FONT_STYLE}
        />
        <Sprite
          x={5 * (width / 8)}
          y={6 * (height / 8)}
          anchor={CENTER_X_CENTER_Y_ANCHOR}
          texture={threatTexture}
          {...scaleWidthHeight(shieldTexture, width / 3)}
        />
      </Container>
    </Container>
  );
});
