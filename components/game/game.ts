// src/store/atoms/game.ts

import { atom } from 'recoil';

export const scoreAtom = atom({
  key: 'scoreAtom', // Unique ID for this atom
  default: 0, // Default score value
});
