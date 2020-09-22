export const peek = (obj: any): any => {
  console.log(JSON.stringify(obj, null, 2));
  return obj;
};

export const rollChance = (chance: number) => () => {
  return Math.random() < chance;
};
