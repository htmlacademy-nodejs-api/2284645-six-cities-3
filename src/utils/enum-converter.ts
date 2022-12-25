export const convertEnumToArray = (item: object): any => Object.keys(item)
  .filter((value) => isNaN(Number(value)) === false)
  .map((key) => (<any>item)[key]);
