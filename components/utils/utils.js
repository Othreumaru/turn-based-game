export const peek = (obj) => {
    console.log(JSON.stringify(obj, null, 2));
    return obj;
};
export const rollChance = (chance) => () => {
    return Math.random() < chance;
};
export const getRandomInt = (minVal, maxVal) => {
    const min = Math.ceil(minVal);
    const max = Math.floor(maxVal);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
//# sourceMappingURL=utils.js.map