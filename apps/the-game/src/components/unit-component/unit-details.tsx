import * as React from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { Stat, Unit, UnitActions } from '../../features/units';

interface Props {
  x?: number;
  y?: number;
  unit: Unit;
}

const getAttackDetails = (action: UnitActions) => {
  if (action.type === 'attack-action') {
    return `${action.minDmg} - ${action.maxDmg}`;
  } else {
    return `${action.minHeal} - ${action.maxHeal}`;
  }
};

const getChanceDetails = (stat: Stat) => {
  return `${stat.current * 100}%`;
};

const getHealthDetails = (stat: Stat) => {
  return `${stat.current}/${stat.max}`;
};

export const PureUnitDetails: React.FC<Props> = ({ x, y, unit }) => {
  return (
    <Container x={x || 0} y={y || 0}>
      {[
        'Name: ' + unit.name,
        'Health: ' + getHealthDetails(unit.stats.hp),
        'Attack: ' + getAttackDetails(unit.action),
        'Hit Chance: ' + getChanceDetails(unit.stats.hitChance),
        'Crit Chance: ' + getChanceDetails(unit.stats.critChance),
      ].map((text, index) => (
        <Text
          key={`${index}`}
          y={index * 30}
          text={text}
          anchor={new PIXI.Point(0, 0)}
          style={{ fontSize: 18, fontWeight: 'bold' }}
        />
      ))}
    </Container>
  );
};

export const UnitDetails = React.memo(PureUnitDetails);
