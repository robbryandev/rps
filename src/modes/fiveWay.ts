import type { WinLossMap } from "./logic"

export const fiveWayOptionList = ["rock", "paper", "scissors", "lizard", "spock"] as const;
export type FiveWayOptions = typeof fiveWayOptionList[number];

export const fiveWayWin: WinLossMap<FiveWayOptions> = {
  rock: { win: ["scissors", "lizard"] },
  paper: { win: ["rock", "spock"] },
  scissors: { win: ["paper", "lizard"] },
  lizard: { win: ["paper", "spock"] },
  spock: { win: ["rock", "scissors"] }
};