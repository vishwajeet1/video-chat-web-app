import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const VideoShow = ({ peer, socket, roomId }) => {
  console.log("peer", peer);
  const myVideo = document.createElement("video");
  myVideo.muted = true;
  const peers = {};
  const mediaDevices = navigator.mediaDevices;
  if (!mediaDevices) {
    return <div>not support</div>;
  }
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      addVideoStream(myVideo, stream, "local-video");
      peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        video.id = call.peer;
        console.log("re", call);
        call.on("stream", (userVideoStream) => {
          console.log("userVideoStream", userVideoStream);
          addVideoStream(video, userVideoStream, "all-video-stream");
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

  socket.on("user-disconnected", (userId) => {
    console.log("disconnect", userId);
    const removedUser = document.getElementById(userId);
    if (removedUser) {
      removedUser.remove();
    }
    if (peers[userId]) peers[userId].close();
  });

  const connectToNewUser = (userId, stream) => {
    console.log("userConnectedId", userId);
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    video.id = userId;
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream, "all-video-stream");
    });
    call.on("close", () => {
      console.log("close");
      video.remove();
    });
    peer[userId] = call;
  };

  peer.on("open", (id) => {
    socket.emit("join-room", roomId, id);
  });

  socket.on("connection", (data) => {
    // console.log(`I'm connected with the back-end`, data);
  });
  socket.on("user-connected", (userId) => {
    console.log(`I'm connected with the back-end`, userId);
  });

  const addVideoStream = (video, stream, appendID) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    document.getElementById(appendID).append(video);
  };

  return (
    <div>
      <div id="local-video" className={`${styles.localVideoClass}`}></div>
      <div id="all-video-stream" className={`${styles.localVideoClass}`}></div>
    </div>
  );
};

export default VideoShow;
