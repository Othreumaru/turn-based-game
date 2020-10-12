export const peek = (obj: any): any => {
  console.log(JSON.stringify(obj, null, 2));
  return obj;
};

export const rollChance = (chance: number) => {
  return Math.random() < chance;
};

export const getRandomInt = (minVal: number, maxVal: number) => {
  const min = Math.ceil(minVal);
  const max = Math.floor(maxVal);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const toSlotId = (column: number, row: number) => `${column}x${row}`;

export const getLayout = (name: string, rows: number, columns: number) =>
  Array.from({ length: rows * columns }).map((_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      id: toSlotId(column, row),
      name,
      column,
      row,
    };
  });
