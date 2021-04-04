import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import VideoShow from "../components/VideoShow";
import socketClient from "socket.io-client";
import { useRouter } from "next/router";
const SERVER = "http://192.168.0.125:8000";
const socket = new socketClient(SERVER, {
  query: {
    "my-key": "my-value",
  },
});
const RoomId = ({ roomId }) => {
  console.log("room ID", roomId);

  const router = useRouter();
  const [myPeer, setMyPeer] = useState(null);
  const joinRoomEventHandler = () => {
    const peer = new Peer(undefined, {
      host: "/",
      port: "3001",
    });
    setMyPeer(peer);
  };

  useEffect(() => {
    joinRoomEventHandler();
  }, []);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
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
