"use client"
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useState } from  'react';

interface Result {
  name: string;
  url: string;
}
interface searchResponse {
  error: String
}

export default function Home() {
  const [isMoved, setIsMoved] = useState(false);
  const [results, setResults] = useState([]);

  const makeSearch = async(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const text = target.value; 
    if(!text && isMoved == true) {
      setIsMoved(!isMoved);
    }
    if(e.key == 'Enter') {
      if(!isMoved) {
        setIsMoved(!isMoved);
      }
      console.log(text);
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: text }),
      });
      if (response.ok) {
        const data = await response.json();
        if(response.error) {

        }
        setResults(data);
        console.log(data);
      } else {
        console.error('Error fetching data');
      }
    }
  }

  return (
    <main className="text-center">
    <Image
    src='/search.png'
    width={20}
    height={20}
    alt='Hello'
    className="w-10 fixed top-5 left-5"
    />
    <h1 className="font-mono text-white fixed top-6 left-1/2">GoFind</h1>
    <div className="absolute m-auto top-0 bottom-0 left-0 right-0 h-100">
      <textarea placeholder="Type anything:" 
      className={`resize-none w-1/2 left-1/4 rounded-lg absolute color-black transition-all ${isMoved ? 'top-5' : 'top-1/2'}`}
      onKeyDown={makeSearch}></textarea>
    </div>
    <div className={`${isMoved ? 'block' : 'hidden'}`} id="results">
      <div>
        {results.map((result : Result, index) => (
          <React.Fragment key={index}>
            <a href={result.url}>{result.name}</a>
            <br />
        </React.Fragment>
        ))}
      </div>
    </div>
    <SpeedInsights/>
    </main>
  );
}