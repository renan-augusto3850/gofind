import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <main className="text-center">
    <Image
    src='/renan-avatar.png'
    width={100}
    height={100}
    alt='Hello'
    className="w-60 shadow-sm position-center"
    />
    <h1 className="font-mono">HELLO, IM RENAN!</h1>
    <SpeedInsights/>
    </main>
  );
}
