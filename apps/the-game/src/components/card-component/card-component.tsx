import * as React from 'react';
import { UnitActions } from '../../features/units';
import { CommonProps } from './types';
import { Container, Text } from 'react-pixi-fiber';
import { Rect } from '../rect';
import { CENTER_X_CENTER_Y_ANCHOR, SMALL_TEXT_FONT_STYLE } from '../../utils';
import { BasicCardComponent } from './basic-card-component';

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
          case 'basic-action':
            return <BasicCardComponent card={card} {...rest} />;
        }
      })()}
    </Container>
  );
});
