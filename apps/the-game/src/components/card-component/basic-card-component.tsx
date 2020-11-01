import * as React from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import { BasicAction } from '../../features/units';
import { CommonProps } from './types';
import {
  FULL_SHIELD_GRAPHICS,
  FULL_THREAT_GRAPHICS,
  getUiTexture,
  HEART_GRAPHICS,
} from '../resources';
import {
  CENTER_X_CENTER_Y_ANCHOR,
  RIGHT_X_CENTER_Y_ANCHOR,
  scaleWidthHeight,
  SMALL_TEXT_FONT_STYLE,
} from '../../utils';

interface Props extends CommonProps {
  card: BasicAction;
}

export const BasicCardComponent = React.memo<Props>(({ x, y, width, height, card }) => {
  const shieldTexture = getUiTexture(FULL_SHIELD_GRAPHICS);
  const threatTexture = getUiTexture(FULL_THREAT_GRAPHICS);
  const heartTexture = getUiTexture(HEART_GRAPHICS);
  const propToTexture: any = {
    shield: shieldTexture,
    threat: threatTexture,
    hp: heartTexture,
  };
  return (
    <Container x={x || 0} y={y || 0}>
      {card.props.map((prop, index) => {
        return (
          <Container key={`${index}`}>
            <Text
              x={10 * (width / 16)}
              y={(6 + index * 3) * (height / 16)}
              anchor={RIGHT_X_CENTER_Y_ANCHOR}
              text={`${card.range}: ${prop.mod > 0 ? '+' : ''}${prop.mod}`}
              style={SMALL_TEXT_FONT_STYLE}
            />
            <Sprite
              x={12 * (width / 16)}
              y={(6 + index * 3) * (height / 16)}
              anchor={CENTER_X_CENTER_Y_ANCHOR}
              texture={propToTexture[prop.stat] || shieldTexture}
              {...scaleWidthHeight(shieldTexture, width / 6)}
            />
          </Container>
        );
      })}
    </Container>
  );
});
