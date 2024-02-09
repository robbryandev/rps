import type { WinLossMap } from "./logic"

export const nineWayOptionList = ["rock", "gun", "water", "air", "paper", "sponge", "human", "scissors", "fire"] as const;
export type NineWayOptions = typeof nineWayOptionList[number];

export const nineWayWin: WinLossMap<NineWayOptions> = {
  "rock": { "win": ["fire", "scissors", "human", "sponge"] },
  "gun": { "win": ["rock", "fire", "scissors", "human"] },
  "water": { "win": ["scissors", "fire", "rock", "gun"] },
  "air": { "win": ["fire", "rock", "gun", "water"] },
  "paper": { "win": ["rock", "gun", "water", "air"] },
  "sponge": { "win": ["paper", "air", "water", "gun"] },
  "human": { "win": ["sponge", "paper", "air", "water"] },
  "scissors": { "win": ["human", "sponge", "paper", "air"] },
  "fire": { "win": ["scissors", "human", "sponge", "paper"] }
};