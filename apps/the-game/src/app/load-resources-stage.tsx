import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { useEffect, useState } from 'react';
import { CENTER_X_CENTER_Y_ANCHOR, getRandomName } from '../utils';
import { AppContext } from './app-context';

import {
  createGoblin,
  createHealer,
  createOrc,
  createWarrior,
  UnitMap,
  unitsSlice,
} from '../features/units';
import { RootState } from './root-reducer';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  onDone: () => void;
}

export const LoadResourcesStageComponent: React.FC<Props> = ({ onDone }) => {
  const { width: viewportWidth, height: viewportHeight } = React.useContext(AppContext);
  const [progress, setProgress] = useState<number>(0);
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(units).length) {
      dispatch(
        unitsSlice.actions.spawnUnits([
          createWarrior(getRandomName(), 'player', 1, 0),
          createWarrior(getRandomName(), 'player', 1, 1),
          createWarrior(getRandomName(), 'player', 1, 2),
          createHealer(getRandomName(), 'player', 0, 1),
          createOrc(getRandomName(), 'enemy', 1, 1),
          createOrc(getRandomName(), 'enemy', 1, 0),
          createGoblin(getRandomName(), 'enemy', 0, 1),
          createWarrior(getRandomName(), 'bench', 1, 0),
        ])
      );
    }
  }, [units, dispatch]);

  useEffect(() => {
    if (Object.keys(units).length !== 0) {
      (async () => {
        console.log('loading unit data...');
        let loader = PIXI.Loader.shared;
        const unitPortraits = new Set(Object.values(units).map((unit) => unit.portrait.img));

        for (const unitPortrait of unitPortraits) {
          loader.add((await import(`../assets/img/${unitPortrait}`)).default);
        }

        loader.onProgress.add((loader, resource) => {
          setProgress(loader.progress);
        });
        loader.onComplete.add(() => {
          onDone();
        });
        loader.load();
      })();
    }
  }, [units]);

  return (
    <Container>
      <Text
        text={`loading ${progress}%`}
        anchor={CENTER_X_CENTER_Y_ANCHOR}
        x={viewportWidth / 2}
        y={viewportHeight / 2}
      />
    </Container>
  );
};
