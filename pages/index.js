import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { FcApproval } from "react-icons/fc";
import publicIp from "public-ip";
export default function Home() {
  const [userPublicIp, setUserPublicIp] = useState("");
  const router = useRouter();
  const getPublicIp = async () => {
    let ipOfUser = "";
    try {
      ipOfUser = await publicIp.v4();
    } catch {
      try {
        ipOfUser = await publicIp.v6();
      } catch {
        ipOfUser = "not found";
      }
    }
    setUserPublicIp(ipOfUser);
  };

  useEffect(() => {
    getPublicIp();
  }, []);

  const handleNewMeeting = () => {
    const uniqueId = uuid();
    console.log(`join_cta userIp - ${userPublicIp} roomId - ${uniqueId}`);
    router.push(`/${uniqueId}`);
  };
  return (
    <div>
      <Head>
        <title>video Chat</title>
        <link rel="icon" href="/chat_video.ico" />
        <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
      </Head>
      <div className="bg-gradient-to-r from-purple-600 via-blue-900 to-indigo-900 h-screen flex justify-center items-center flex-col">
        <div className="text-2xl font-bold text-white p-4 my-8 text-center rounded-full flex items-center">
          <div className="pr-2">Video Calling App</div> <FcApproval className />
        </div>
        <button
          onClick={handleNewMeeting}
          className={`bg-green-400 text-white font-bold p-4 rounded `}
        >
          Create New Meeting
        </button>
      </div>
    </div>
  );
}
