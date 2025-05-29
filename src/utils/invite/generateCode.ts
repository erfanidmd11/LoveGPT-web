// src/utils/invite/generateCode.ts

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateCode = (length: number = 6): string => {
  return 'LOVE-' + Array.from({ length }, () =>
    CHARSET[Math.floor(Math.random() * CHARSET.length)]
  ).join('');
};
