import * as React from 'react';
import { Container, Graphics, Sprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import { useEffect, useState } from 'react';

interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  img: string;
  textureXOffset?: number;
  textureYOffset?: number;
  textureXScale?: number;
  textureYScale?: number;
  shape?: 'rect' | 'ellipse';
}

export const PureMaskedSprite: React.FC<Props> = ({
  x,
  y,
  img,
  width,
  height,
  textureXOffset,
  textureYOffset,
  textureXScale,
  textureYScale,
  shape,
}) => {
  const [graphics, setGraphics] = useState<PIXI.Graphics>();
  const [texture, setTexture] = useState<PIXI.Texture>();
  const [ratio, setRatio] = useState<number>(1);
  useEffect(() => {
    const ctx = graphics;
    if (!ctx) {
      return;
    }
    ctx.clear();
    ctx.beginFill(0xffffff, 1);
    ctx.lineStyle(0);
    if (shape === 'ellipse') {
      ctx.drawEllipse(width / 2, height / 2, width / 2, height / 2);
    } else {
      ctx.drawRect(0, 0, width, height);
    }
    ctx.endFill();
  }, [graphics, width, height]);

  useEffect(() => {
    import(`../../assets/img/${img}`).then((imgData) => {
      const texture = PIXI.Loader.shared.resources[imgData.default].texture;
      setTexture(texture);
      setRatio(texture.height / texture.width);
    });
  }, [img]);

  const spriteWidth = width * (textureXScale || 1);
  const spriteHeight = height * ratio * (textureYScale || 1);

  return (
    <Container x={x || 0} y={y || 0} width={width} height={height}>
      <Graphics
        ref={(graphics) => {
          setGraphics(graphics as any);
        }}
      />
      {graphics && texture && (
        <Sprite
          x={(textureXOffset || 0) * spriteWidth}
          y={(textureYOffset || 0) * spriteHeight}
          width={spriteWidth}
          height={spriteHeight}
          texture={texture}
          mask={graphics}
        />
      )}
    </Container>
  );
};

export const MaskedSprite = React.memo(PureMaskedSprite);
