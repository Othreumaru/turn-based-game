import * as React from 'react';
import { Stage, Sprite } from 'react-pixi-fiber';
import { hot } from 'react-hot-loader/root';
import { DraggableContainer } from '../draggable-container';
import * as PIXI from 'pixi.js';
import { DroppableContainer } from '../droppable-container';
import spriteTexture from '../../assets/0_dot.png';

interface Props {
  app: PIXI.Application;
}

const StageComponent: React.FC<Props> = ({ app }) => {
  // const [state, setState] = useState<State>({});

  return (
    <Stage app={app}>
      <DroppableContainer
        x={300}
        y={100}
        width={100}
        height={100}
        onDrop={(transferObject) => {
          console.log(transferObject);
        }}
      />
      <DraggableContainer app={app} transferObject={{}} x={100} y={100}>
        <Sprite x={0} y={0} texture={PIXI.Texture.from(spriteTexture)} />
      </DraggableContainer>
    </Stage>
  );
};

export const MainStage = hot(StageComponent);
