export const housingTypes = [
  'apartment',
  'house',
  'room',
  'hotel',
] as const;
export type HousingType = typeof housingTypes[number];
