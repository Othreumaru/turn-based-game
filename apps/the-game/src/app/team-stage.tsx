import * as React from 'react';
import * as PIXI from 'pixi.js';
import { Container, Text } from 'react-pixi-fiber';
import { Button } from '../components/button/button';

interface Props {
  onDone: () => void;
}

export const TeamStageComponent: React.FC<Props> = ({ onDone }) => {
  return (
    <Container x={200} y={200}>
      <Text
        text={'Hello from team select stage'}
        anchor={new PIXI.Point(0, 0)}
        style={{ fontSize: 18, fontWeight: 'bold' }}
      />
      <Button y={100} width={200} height={30} label={'complete stage'} onClick={onDone} />
    </Container>
  );
};
