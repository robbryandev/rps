import type { ModeOptions } from "@/pages/setup"
import { type ClassicOptions, classicOptionList, classicWin } from "./classic"
import { type FiveWayOptions, fiveWayOptionList, fiveWayWin } from "./fiveWay"

export type WinState = "win" | "lose" | "tie"

export type WinLossMap<T extends string> = {
  [K in T]: {
    win: Exclude<T, K>[],
    loss: Exclude<T, K>[]
  }
}

export function winState<T extends string>(conditions: WinLossMap<T>, play: T, otherPlay: T): WinState {
  const win: string[] = [...conditions[play].win]
  const loss: string[] = [...conditions[play].loss]
  if (win.includes(otherPlay)) {
    return "win"
  }
  if (loss.includes(otherPlay)) {
    return "lose"
  }
  return "tie"
}

export type GenericWinCheck = ClassicOptions | FiveWayOptions;
export function getModeOptions(mode: ModeOptions) {
  switch (mode) {
    case "classic":
      return {
        "winOptions": classicWin,
        "options": classicOptionList
      }
    case "fiveWay":
      return {
        "winOptions": fiveWayWin,
        "options": fiveWayOptionList
      }
    default:
      break;
  }
}