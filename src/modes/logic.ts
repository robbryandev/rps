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