export const getRandomValue = (min: number, max: number, numAfterDigit = 0) => +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPos = getRandomValue(0, items.length - 1);
  const endPos = startPos + getRandomValue(startPos, items.length);
  return items.slice(startPos, endPos);
};

export const getRandomItem = <T>(items: T[]): T =>
  items[getRandomValue(0, items.length - 1)];
