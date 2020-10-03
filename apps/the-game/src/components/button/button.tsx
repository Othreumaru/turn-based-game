import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { Rect } from '../rect';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  label: string;
  onClick: () => void;
}

export const Button: React.FC<Props> = ({ x, y, width, height, label, onClick }) => {
  return (
    <Container
      x={x || 0}
      y={y || 0}
      width={width}
      height={height}
      interactive={true}
      click={onClick}
    >
      <Rect width={width} height={height} lineColor={0xff0000} />
      <Text text={label} />
    </Container>
  );
};
