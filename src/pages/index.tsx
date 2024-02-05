import { Inter } from "next/font/google";
import Link from "next/link";
import type { Socket } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ socket }: { socket: Socket }) {
  return (
    <main className={`${inter.className}`}>
      <p className="text-4xl">Hello, {socket?.id}</p>
      <Link href={"/setup"}>New Game</Link>
    </main>
  );
}
