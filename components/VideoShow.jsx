import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { HiPhoneMissedCall, HiVideoCamera } from "react-icons/hi";
import { BiVideoOff } from "react-icons/bi";
import { useRouter } from "next/router";

const VideoShow = ({ peer, socket, roomId }) => {
  const handleCloseMeeting = () => {
    window.open("/", "_self");
  };
  const [userMic, setUserMic] = useState(true);
  const [userVideo, setUserVideo] = useState(true);
  const [localStream, setLocalStream] = useState(null);

  const myVideo = document.createElement("video");
  myVideo.id = peer.id;
  myVideo.muted = true;
  let peersUsers = [];
  const mediaDevices = navigator.mediaDevices;
  if (!mediaDevices) {
    return <div>not support</div>;
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        addVideoStream(myVideo, stream, "local-video", peer.id);
        peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(
              video,
              userVideoStream,
              "all-video-stream",
              call.peer
            );
          });
          call.on("closed", () => {
            console.log("close");
            video.remove();
          });
        });
        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      })
      .catch(console.log);
  }, []);

  socket.on("user-disconnected", (userId) => {
    console.log("disconnect", peersUsers);
    const index = peersUsers.indexOf(userId);
    if (index > -1) {
      peersUsers.splice(index, 1);
    }
    console.log("after disconnect", peersUsers);
    const removedUser = document.getElementById(userId);
    if (removedUser) {
      removedUser.remove();
    }
  });

  const connectToNewUser = (userId, stream) => {
    console.log("userConnectedId", userId);
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream, "all-video-stream", userId);
    });
    call.on("close", () => {
      console.log("close");
      video.remove();
    });
  };

  peer.on("open", (id) => {
    socket.emit("join-room", roomId, id);
  });

  socket.on("connection", (data) => {
    // console.log(`I'm connected with the back-end`, data);
  });
  socket.on("user-connected", (userId) => {
    console.log(`user-connected`, userId);
  });

  const addVideoStream = (video, stream, appendID, userId) => {
    if (peersUsers.includes(userId)) {
      return;
    }
    peersUsers.push(userId);
    video.srcObject = stream;
    video.id = userId;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    document.getElementById(appendID).append(video);
  };

  const toggleMic = () => {
    if (!localStream) {
      return;
    }
    if (userMic) {
      localStream.getAudioTracks()[0].enabled = false;
    } else {
      localStream.getAudioTracks()[0].enabled = true;
    }
    userMic ? setUserMic(false) : setUserMic(true);
  };
  const toggleVideo = () => {
    if (!localStream) {
      return;
    }
    if (userVideo) {
      localStream.getVideoTracks()[0].enabled = false;
    } else {
      localStream.getVideoTracks()[0].enabled = true;
    }
    userVideo ? setUserVideo(false) : setUserVideo(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="flex">
        <div
          id="all-video-stream"
          className={`${styles.videoGridClass} w-2/3`}
        ></div>
        <div
          id="local-video"
          className={`${styles.localVideoClass} absolute top-0 right-0`}
        ></div>
      </div>

      <div className="absolute bottom-0 w-full">
        <div className="flex w-full justify-around text-2xl bg-white py-2">
          <div
            className={`p-3 rounded-full border-2 cursor-pointer ${
              !userMic && "bg-red-500 text-white"
            }`}
            onClick={toggleMic}
          >
            {userMic ? <IoIosMic /> : <IoIosMicOff />}
          </div>
          <div
            className="p-3 rounded-full border-2 bg-red-500 text-white cursor-pointer"
            onClick={handleCloseMeeting}
          >
            <HiPhoneMissedCall></HiPhoneMissedCall>
          </div>
          <div
            className={`p-3 rounded-full border-2 cursor-pointer ${
              !userVideo && "bg-red-500 text-white"
            }`}
            onClick={toggleVideo}
          >
            {userVideo ? <HiVideoCamera /> : <BiVideoOff />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoShow;
