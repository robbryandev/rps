import type { WinLossMap } from "./logic"

export const classicOptionList = ["rock", "paper", "scissors"] as const;
export type ClassicOptions = typeof classicOptionList[number];

export const classicWin: WinLossMap<ClassicOptions> = {
  rock: { win: ["scissors"] },
  paper: { win: ['rock'] },
  scissors: { win: ["paper"] }
};