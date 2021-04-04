import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  const handleNewMeeting = () => {
    router.push(`/${uuid()}`);
  };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
      </Head>
      <div>
        <button
          onClick={handleNewMeeting}
          className={`bg-green-400 text-white font-bold p-4 `}
        >
          Create New Meeting
        </button>
      </div>
    </div>
  );
}
