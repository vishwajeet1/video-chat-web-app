import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import VideoShow from "../components/VideoShow";
import socketClient from "socket.io-client";
import publicIp from "public-ip";
const SERVER = "https://frozen-coast-85988.herokuapp.com";
const socket = new socketClient(SERVER, {
  query: {
    "my-key": "my-value",
  },
});
const RoomId = ({ roomId }) => {
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
    console.log(`joined_room userIp - ${ipOfUser} roomId - ${roomId}`);
  };

  useEffect(() => {
    getPublicIp();
  }, []);
  const [myPeer, setMyPeer] = useState(null);
  const joinRoomEventHandler = () => {
    const peer = new Peer(undefined);
    setMyPeer(peer);
  };

  useEffect(() => {
    joinRoomEventHandler();
  }, []);
  return (
    <div>
      <Head>
        <title>video Chat</title>
        <link rel="icon" href="/chat_video.ico" />
        <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
      </Head>
      {myPeer && <VideoShow peer={myPeer} socket={socket} roomId={roomId} />}
    </div>
  );
};

RoomId.getInitialProps = async (ctx) => {
  return { roomId: ctx.query.roomId };
};

export default RoomId;
