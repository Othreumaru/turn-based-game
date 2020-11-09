import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { Rect } from '../rect';
import { PropsWithChildren, useState } from 'react';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  type: 'enabled' | 'disabled';
  onClick: () => void;
}

const CLICKED_SCALE = 0.8;

export const Button = React.memo<PropsWithChildren<Props>>(
  ({ x, y, width, height, onClick, children, type }) => {
    const [highlighted, setHighlighted] = useState<Boolean>(false);
    const [resized, setResized] = useState<Boolean>(false);

    const onMouseClick = () => {
      if (type !== 'disabled') {
        onClick();
      }
    };

    const onMouseOver = () => {
      setHighlighted(true);
    };

    const onMouseOut = () => {
      setHighlighted(false);
    };

    const onMouseDown = () => {
      if (type !== 'disabled') {
        setResized(true);
      }
    };

    const onMouseUp = () => {
      setResized(false);
    };

    const containerWidth = resized ? width * CLICKED_SCALE : width;
    const containerHeight = resized ? height * CLICKED_SCALE : height;
    const containerX = resized ? (x || 0) + (width - containerWidth) / 2 : x || 0;
    const containerY = resized ? (y || 0) + (height - containerHeight) / 2 : y || 0;
    const baseColor = type === 'enabled' ? 0x00ff00 : 0xff0000;
    const highlightedColor = type === 'enabled' ? 0x00dd00 : 0xdd0000;

    return (
      <Container
        x={containerX}
        y={containerY}
        width={containerWidth}
        height={containerHeight}
        interactive={true}
        mouseover={onMouseOver}
        mouseout={onMouseOut}
        mousedown={onMouseDown}
        mouseup={onMouseUp}
        mouseupoutside={onMouseUp}
        click={onMouseClick}
      >
        <Rect
          width={width}
          height={height}
          fillColor={highlighted ? highlightedColor : baseColor}
          radius={6}
        />
        {children}
      </Container>
    );
  }
);
