import { GameSettings, getRoundString } from "@/pages/setup";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type { RoundOptions } from "@/pages/setup";
import { WinLossMap, winState, type WinState } from "@/modes/logic";

export default function MainGame<T extends string>({
  socket, settings, room, winOptions, options }: {
    socket: Socket, settings: GameSettings, room: string,
    winOptions: WinLossMap<T>, options: readonly string[]
  }) {

  const [rounds] = useState<RoundOptions>(settings.rounds);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [userPick, setUserPick] = useState<T>();
  const [otherPick, setOtherPick] = useState<T>();
  const [wins, setWins] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [roundState, setRoundState] = useState<WinState>();

  useEffect(() => {
    if (socket.connected) {
      socket.on("sync_pick", (pickDataString: any) => {
        const pickData = JSON.parse(pickDataString);
        if (pickData.player !== socket.id) {
          setOtherPick(pickData.pick)
        }
      })
    }
  }, [])

  const getWinCount = (rounds: RoundOptions) => {
    switch (rounds) {
      case 3:
        return 2
      case 5:
        return 3
      default:
        return 2
    }
  }

  useEffect(() => {
    if (userPick && otherPick && currentRound <= rounds && wins !== getWinCount(rounds)) {
      const currentRoundState = winState<T>(winOptions, userPick, otherPick);
      setRoundState(currentRoundState)
      setTimeout(() => {
        switch (currentRoundState) {
          case "win":
            setWins(wins + 1);
            if (wins + 1 === getWinCount(rounds)) {
              setGameOver(true);
              break
            }
            setCurrentRound(currentRound + 1);
            break;
          case "lose":
            if (loss + 1 === getWinCount(rounds)) {
              setGameOver(true);
              break
            }
            setLoss(loss + 1);
            setCurrentRound(currentRound + 1);
            break;
          default:
            break;
        }
        setRoundState(undefined);
        if (currentRound + 1 > rounds && currentRoundState !== "tie") {
          setGameOver(true);
        } else {
          setUserPick(undefined);
          setOtherPick(undefined);
        }
      }, 2_000)
    }
  }, [userPick, otherPick, rounds])

  return (
    <>
      <p className="text-2xl">{settings.modeName} mode</p>
      <p className="text-2xl">Rounds: {getRoundString(rounds)}</p>
      <p className="text-2xl">Round: {currentRound}</p>
      <p className="text-2xl">Wins: {wins}</p>

      <br />
      {
        gameOver ? (
          <>
            Game Over: {wins === getWinCount(rounds) ? "Winner" : "Loser"}
          </>
        ) :
          userPick && otherPick ? (
            <>
              <p>
                {roundState}
              </p>
            </>
          ) : userPick ? (
            <p className="text-2xl">picked: {userPick}</p>
          ) : options.map((opt) => {
            return (
              <button onClick={() => {
                setUserPick(opt as T);
                socket.emit("picked", JSON.stringify({ option: opt, code: room }))
              }} className="px-4 underline" key={opt}>
                {opt}
              </button>
            )
          })
      }
      <div className="w-72 h-auto">
        <img className="grayscale" src={`/${settings.mode}.png`} alt="mode instructions" />
      </div>
    </>
  )
}