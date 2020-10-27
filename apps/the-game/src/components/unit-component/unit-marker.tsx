import * as React from 'react';
import { Sprite, Text } from 'react-pixi-fiber';
import { CENTER_X_CENTER_Y_ANCHOR } from '../../utils';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  uiResourceName: string;
  counter: number;
}

export const PureUnitMarker: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  uiResourceName,
  counter,
}) => {
  const texture = PIXI.Loader.shared.resources[uiResourceName].texture;
  return (
    <>
      <Sprite
        x={x || 0}
        y={y || 0}
        width={width}
        height={height}
        texture={texture}
        anchor={CENTER_X_CENTER_Y_ANCHOR}
      />
      <Text x={x || 0} y={y || 0} text={`${counter}`} anchor={CENTER_X_CENTER_Y_ANCHOR} />
    </>
  );
};

export const UnitMarker = React.memo(PureUnitMarker);
