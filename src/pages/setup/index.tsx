import { Inter } from "next/font/google";
import type { Socket } from "socket.io-client";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Setup({ socket }: { socket: Socket }) {
  return (
    <main className={`${inter.className}`}>
      <p className="text-4xl">Hello, {socket?.id}</p>
      <Link href={"/"}>Cancel</Link>
    </main>
  );
}
