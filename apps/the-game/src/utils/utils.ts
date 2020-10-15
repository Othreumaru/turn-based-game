import { SlotPointer } from '../components/types';
import { LEFT_X_TOP_Y_ANCHOR } from './constants';

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
export const slotToKey = (prefix: string, slot: SlotPointer) => {
  return `${prefix}:${slot.name}:${slot.column}x${slot.row}`;
};

export const getLayout = (name: string, rows: number, columns: number): SlotPointer[] =>
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

export interface GetPixelLayoutProps {
  name: string;
  rows: number;
  columns: number;
  anchor?: PIXI.Point;
  slotSize?: number;
  slotSpacer?: number;
  mirrorX?: boolean;
}

export interface ProjectedSlotPointer {
  slot: SlotPointer;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getLayoutProjection = (props: GetPixelLayoutProps): ProjectedSlotPointer[] => {
  const {
    name = '',
    rows = 0,
    columns = 0,
    slotSize = 150,
    slotSpacer = 10,
    mirrorX = false,
    anchor = LEFT_X_TOP_Y_ANCHOR,
  } = props;

  const segmentWith = slotSize + slotSpacer;
  const offsetX = anchor.x * (columns * segmentWith);
  const offsetY = anchor.y * (rows * segmentWith);

  return getLayout(name, rows, columns).map(({ id, column, row }) => {
    const columnOffset = mirrorX ? columns - column : column;

    return {
      slot: { id, name, row, column },
      x: columnOffset * segmentWith - offsetX,
      y: row * segmentWith - offsetY,
      width: slotSize,
      height: slotSize,
    };
  });
};

export const getRandomName = () => {
  const names = [
    'Arler',
    'Awskin',
    'Undwor',
    'Therat',
    'Chyer',
    'Scheusk',
    'Eroldu',
    'Shybtor',
    'Waradi',
    'Shytai',
    'Delan',
    'Oughlche',
    'Llypol',
    'Umath',
    'Katin',
    'Nysardy',
    'Cerist',
    'Nysok',
    'Ostbur',
    'Tanechi',
    'Leref',
    'Worunt',
    'Lyorm',
    'Kelit',
    'Versough',
    'Ombund',
    'Arast',
    'Serough',
    'Eldiq',
    'Iaw',
    'Quaunti',
    'Kimcera',
    'Dralnal',
    'Nalacki',
    'Osttor',
    'Schither',
    'Turigh',
    'Taiaughi',
    'Raylach',
    'Zhuem',
    'Endagei',
    'Arduph',
    'Korak',
    'Cuia',
    'Ighten',
    'Rhyeng',
    'Raknqua',
    'Rothpess',
    'Eron',
    'Iaint',
    'Poltin',
    'Lyemald',
    'Rothig',
    'Vyia',
    'Arenu',
    'Rayete',
    'Oning',
    'Broild',
    'Orati',
    'Tasos',
    'Rakper',
    'Noight',
    'Athlye',
    'Atacke',
    'Pias',
    'Endbar',
    'Torolda',
    'Bellunt',
    'Chragha',
    'Tonvim',
    'Ashos',
    'Echryn',
    'Queem',
    'Adyard',
    'Adano',
    'Dynwim',
    'Yerchea',
    'Issamu',
    'Uskhack',
    'Serale',
    'Vorjight',
    'Dogha',
    'Endurt',
    'Hosay',
    'Ryntack',
    'Inahcer',
    'Oldtory',
    'Lyeold',
    'Serom',
    'Tiaking',
    'Ackuth',
    'Chewser',
    'Lyehata',
    'Radimo',
    'Theront',
    'Enthol',
    'Endtale',
    'Rothem',
    'Lyekack',
    'Estem',
    'Essar',
    'Stoit',
    'Raydbur',
    'Atbtas',
    'Echkin',
    'Siray',
    'Orale',
    'Emech',
    'Rodtang',
    'Risnom',
    'Atom',
    'Karak',
    'Daror',
    'Rodos',
    'Tanad',
    'Truque',
    'Ardcha',
    'Kiran',
    'Risser',
  ];
  const index = getRandomInt(0, names.length - 1);
  return names[index];
};
