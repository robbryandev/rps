import { type ClassicOptions, classicOptionList, classicWin } from "./classic"
import { type FiveWayOptions, fiveWayOptionList, fiveWayWin } from "./fiveWay"
import { NineWayOptions, nineWayOptionList, nineWayWin } from "./nineWay"
import { type SevenWayOptions, sevenWayOptionList, sevenWayWin } from "./sevenWay"

export type WinState = "win" | "lose" | "tie"

export type WinLossMap<T extends string> = {
  [K in T]: {
    win: Exclude<T, K>[]
  }
}

export function winState<T extends string>(conditions: WinLossMap<T>, play: T, otherPlay: T): WinState {
  const win: string[] = [...conditions[play].win]
  if (win.includes(otherPlay)) {
    return "win"
  }
  else if (otherPlay !== play) {
    return "lose"
  }
  return "tie"
}

export type ModeOptions = "classic" | "fiveWay" | "sevenWay" | "nineWay"
export type GenericWinCheck = ClassicOptions | FiveWayOptions | SevenWayOptions | NineWayOptions;
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
    case "sevenWay":
      return {
        "winOptions": sevenWayWin,
        "options": sevenWayOptionList
      }
    case "nineWay":
      return {
        "winOptions": nineWayWin,
        "options": nineWayOptionList
      }
    default:
      break;
  }
}