import Image from "next/image";

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
    </main>
  );
}
