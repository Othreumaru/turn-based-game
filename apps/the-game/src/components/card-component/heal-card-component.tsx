import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { HealAction } from '../../features/units';
import { CommonProps } from './types';

interface Props extends CommonProps {
  card: HealAction;
}

export const HealCardComponent = React.memo<Props>(({ x, y }) => {
  return <Container x={x || 0} y={y || 0}></Container>;
});
