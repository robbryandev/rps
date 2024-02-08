import type { WinLossMap } from "./logic"

export const fiveWayOptionList = ["rock", "paper", "scissors", "lizard", "spock"] as const;
export type FiveWayOptions = typeof fiveWayOptionList[number];

export const fiveWayWin: WinLossMap<FiveWayOptions> = {
  rock: { win: ["scissors", "lizard"], loss: ["paper", "spock"] },
  paper: { win: ["rock", "spock"], loss: ["scissors", "lizard"] },
  scissors: { win: ["paper", "lizard"], loss: ["spock", "rock"] },
  lizard: { win: ["paper", "spock"], loss: ["scissors", "rock"] },
  spock: { win: ["rock", "scissors"], loss: ["paper", "lizard"] }
};