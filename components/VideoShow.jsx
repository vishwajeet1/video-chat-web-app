import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { v4 as uuid } from "uuid";
import Controller from "./Controller";
import { elementId, elementName, className } from "constant";

const VideoShow = ({ peer, socket, roomId, publicIp }) => {
  const [copyLinkState, setCopyLinkState] = useState(true);
  const [copyLink, setCopyLink] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  let peersUsers = [];
  const mediaDevices = navigator.mediaDevices;
  if (!mediaDevices) {
    return <div>not support</div>;
  }

  useEffect(() => {
    const myVideo = document.createElement(elementName.VIDEO_ELEMENT);
    myVideo.muted = true;
    myVideo.volume = 0.1;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        stream.getAudioTracks()[0].enabled = false;
        stream.getVideoTracks()[0].enabled = false;
        addVideoStream(
          myVideo,
          stream,
          elementId.LOCAL_STREAM,
          uuid(),
          "muted"
        );
        peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement(elementName.VIDEO_ELEMENT);
          call.on("stream", (userVideoStream) => {
            addVideoStream(
              video,
              userVideoStream,
              elementId.REMOTE_USER_STREAM,
              call.peer
            );
          });
          call.on("closed", () => {
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
    const index = peersUsers.indexOf(userId);
    if (index > -1) {
      peersUsers.splice(index, 1);
    }
    const removedUser = document.getElementById(userId);
    if (removedUser) {
      removedUser.remove();
    }
    toggleVideoStyle();
  });

  const constCalculateWidth = (num) => {
    let result = null;
    for (let i = 1; i <= num; i++) {
      if (i * i >= num) {
        result = i;
        break;
      }
    }
    return result;
  };

  const toggleVideoStyle = () => {
    const videoList = document.getElementsByClassName(className.REMOTE_STREAM);
    if (!videoList.length) return;
    setCopyLinkState(false);
    const videoLen = videoList.length;
    let heightOfVideoContainer = document.getElementById(
      elementId.REMOTE_STREAM_CONTAINER
    ).clientHeight;
    let widthOfVideoContainer = document.getElementById(
      elementId.REMOTE_STREAM_CONTAINER
    ).clientWidth;
    const videoSize = constCalculateWidth(videoLen);
    for (let i = 0; i < videoLen; i++) {
      videoList[i].style.width = `${widthOfVideoContainer / videoSize}px`;
      let rowCount = Math.ceil(videoLen / videoSize);
      videoList[i].style.height = `${heightOfVideoContainer / rowCount}px`;
    }
  };

  const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement(elementName.VIDEO_ELEMENT);
    call.on("stream", (userVideoStream) => {
      addVideoStream(
        video,
        userVideoStream,
        elementId.REMOTE_USER_STREAM,
        userId
      );
    });
    call.on("close", () => {
      video.remove();
    });
  };

  peer.on("open", (id) => {
    socket.emit("join-room", roomId, id, publicIp);
  });

  socket.on("user-connected", (userId) => {});

  const addVideoStream = (
    video,
    stream,
    appendID,
    userId,
    muteVariable = false
  ) => {
    if (peersUsers.includes(userId)) {
      return;
    }
    peersUsers.push(userId);
    video.srcObject = stream;
    video.id = userId;
    video.muted = muteVariable;
    if (appendID == elementId.REMOTE_USER_STREAM) {
      video.classList.add(className.REMOTE_STREAM);
      video.classList.add("object-cover");
    }
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    document.getElementById(appendID).append(video);
    toggleVideoStyle();
  };

  const copyLinkHandler = () => {
    setCopyLink(true);
    const meetingLink = window.location.href;
    navigator.clipboard.writeText(meetingLink);
  };

  return (
    <div
      className="relative bg-gray-900 flex items-center justify-center"
      style={{ height: "calc(100vh - 75px" }}
    >
      {copyLinkState && (
        <div className={`${styles.fixMid}`}>
          <button
            className={`px-4 md:px-8 py-2 ${
              copyLink ? "bg-green-300" : "bg-green-500"
            }
            text-white font-bold text-xl
            `}
            onClick={copyLinkHandler}
          >
            {copyLink ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
      <div
        className="w-full h-full flex items-start justify-center"
        id={elementId.REMOTE_STREAM_CONTAINER}
      >
        <div
          id={elementId.REMOTE_USER_STREAM}
          className={`${styles.videoGridClass} flex justify-center items-center flex-wrap `}
        ></div>
      </div>
      <div
        id={elementId.LOCAL_STREAM}
        className={`${styles.localVideoClass} absolute top-0 right-0`}
      ></div>
      <Controller localStream={localStream} />
    </div>
  );
};

export default VideoShow;
