export const userTypes = ['обычный', 'pro'] as const;
export type UserType = typeof userTypes[number];
