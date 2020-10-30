import * as React from 'react';
import { UnitActions } from '../../features/units';
import { AttackCardComponent } from './attack-card-component';
import { HealCardComponent } from './heal-card-component';
import { DefensiveStanceCardComponent } from './defensive-stance-card-component';
import { CommonProps } from './types';
import { Container, Text } from 'react-pixi-fiber';
import { Rect } from '../rect';
import { CENTER_X_CENTER_Y_ANCHOR, SMALL_TEXT_FONT_STYLE } from '../../utils';

interface Props extends CommonProps {
  card: UnitActions;
}

export const CardComponent = React.memo<Props>(({ card, ...rest }) => {
  return (
    <Container>
      <Rect width={rest.width} height={rest.height} fillColor={0x000000} lineWidth={3} />
      <Text
        x={rest.width / 2}
        y={rest.height * 0.1}
        text={card.name}
        anchor={CENTER_X_CENTER_Y_ANCHOR}
        style={SMALL_TEXT_FONT_STYLE}
      />
      {(() => {
        switch (card.type) {
          case 'attack-action':
            return <AttackCardComponent card={card} {...rest} />;
          case 'heal-action':
            return <HealCardComponent card={card} {...rest} />;
          case 'defensive-stance-action':
            return <DefensiveStanceCardComponent card={card} {...rest} />;
        }
      })()}
    </Container>
  );
  return null;
});
