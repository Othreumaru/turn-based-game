import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { useEffect, useState } from 'react';
import { CENTER_X_CENTER_Y_ANCHOR } from '../utils';
import { AppContext } from './app-context';

import { UnitMap } from '../features/units';
import { RootState } from './root-reducer';
import { useSelector } from 'react-redux';
import { UI_RESOURCES } from '../components/resources';

interface Props {
  onDone: () => void;
}

export const LoadResourcesStageComponent: React.FC<Props> = ({ onDone }) => {
  const { width: viewportWidth, height: viewportHeight } = React.useContext(AppContext);
  const [progress, setProgress] = useState<number>(0);
  const units = useSelector<RootState, UnitMap>((state) => state.game.units);

  useEffect(() => {
    if (Object.keys(units).length !== 0) {
      (async () => {
        console.log('loading unit data...');
        let loader = PIXI.Loader.shared;
        const unitPortraits = new Set(Object.values(units).map((unit) => unit.portrait.img));

        for (const unitPortrait of unitPortraits) {
          loader.add((await import(`../assets/img/${unitPortrait}`)).default);
        }

        for (const { name, location } of UI_RESOURCES) {
          loader.add(name, (await import(`../assets/img/${location}`)).default);
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
