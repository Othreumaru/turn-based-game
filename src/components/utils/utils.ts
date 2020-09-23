export const peek = (obj: any): any => {
  console.log(JSON.stringify(obj, null, 2));
  return obj;
};

export const rollChance = (roll: number, chance: number) => () => {
  return roll < chance;
};
