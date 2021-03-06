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

export const listToMapReducer = (acc: any, item: { id: string }): any => {
  return {
    ...acc,
    [item.id]: item,
  };
};
export const listToMap = (list: any[]) => list.reduce(listToMapReducer, {});

export const scaleWidthHeight = (texture: { width: number; height: number }, width: number) => {
  const ratio = texture.height / texture.width;
  return {
    width,
    height: width * ratio,
  };
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
