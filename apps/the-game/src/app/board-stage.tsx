import * as React from 'react';
import { Container } from 'react-pixi-fiber';
import { AppContext } from './app-context';
import * as R from 'ramda';
import { Rect } from '../components/rect';
import { MaskedSprite } from '../components/masked-sprite';
import { HealthBar } from '../components/health-bar';

interface Props {
  onDone: () => void;
}

interface Vector2D {
  x: number;
  y: number;
}

const indexToLocation = (width: number, height: number) => (index: number) => ({
  x: index % width,
  y: Math.floor(index / height),
});
const getBoard = (width: number, height: number) =>
  R.map(indexToLocation(width, height), R.range(0, width * height));

const getBoardGrid = (
  tilesInXDimension: number,
  tilesInYDimension: number,
  tileWidth: number,
  tileHeight: number,
  tileSpacer: number
) => {
  const tileAndSpacerWidth = tileWidth + tileSpacer;
  const tileAndSpacerHeight = tileHeight + tileSpacer;
  const width = tilesInXDimension * tileAndSpacerWidth;
  const height = tilesInYDimension * tileAndSpacerHeight;
  const getTile = ({ x, y }: { x: number; y: number }) => ({
    x: x * tileAndSpacerWidth,
    y: y * tileAndSpacerHeight,
    tileWidth,
    tileHeight,
  });
  return {
    width,
    height,
    tileAndSpacerWidth,
    tileAndSpacerHeight,
    tiles: getBoard(tilesInXDimension, tilesInYDimension).map(getTile),
  };
};

const getBoardPosition = (
  position: Vector2D,
  tileAndSpacerWidth: number,
  tileAndSpacerHeight: number
) => {
  return {
    x: position.x * tileAndSpacerWidth,
    y: position.y * tileAndSpacerHeight,
  };
};

export const BoardStageComponent: React.FC<Props> = () => {
  const { width: viewportWidth, height: viewportHeight } = React.useContext(AppContext);
  const board = getBoardGrid(16, 16, 64, 64, 3);
  const unit = {
    x: 3,
    y: 4,
  };
  const token: Vector2D = getBoardPosition(
    unit,
    board.tileAndSpacerWidth,
    board.tileAndSpacerHeight
  );
  return (
    <Container>
      <Container x={viewportWidth / 2 - board.width / 2} y={viewportHeight / 2 - board.height / 2}>
        {board.tiles.map(({ x, y, tileHeight, tileWidth }) => (
          <Rect
            key={`${x}:${y}`}
            x={x}
            y={y}
            width={tileWidth}
            height={tileHeight}
            fillColor={0xcccccc}
          />
        ))}
        <Container x={token.x} y={token.y}>
          <MaskedSprite
            width={64}
            height={64}
            img={'portraits/195.png'}
            textureXOffset={-0.24}
            textureYOffset={-0.12}
            textureXScale={2}
            textureYScale={2}
            shape={'ellipse'}
          />
          <HealthBar x={-16} y={-6} hp={10} maxHp={12} width={96} height={6} spacerThickness={2} />
        </Container>
      </Container>
    </Container>
  );
};
