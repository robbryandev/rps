import type { WinLossMap } from "./logic"

export const sevenWayOptionList = ["rock", "paper", "scissors", "water", "air", "fire", "sponge"] as const;
export type SevenWayOptions = typeof sevenWayOptionList[number];

export const sevenWayWin: WinLossMap<SevenWayOptions> = {
  rock: { win: ["fire", "scissors", "sponge"] },
  paper: { win: ["water", "rock", "air"] },
  scissors: { win: ["air", "paper", "sponge"] },
  water: { win: ["rock", "fire", "scissors"] },
  air: { win: ["fire", "rock", "water"] },
  fire: { win: ["paper", "sponge", "scissors"] },
  sponge: { win: ["water", "air", "paper"] }
};