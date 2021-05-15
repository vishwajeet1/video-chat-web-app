import React, { useEffect, useState } from "react";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { HiPhoneMissedCall, HiVideoCamera } from "react-icons/hi";
import { BiVideoOff } from "react-icons/bi";

const Controller = ({ localStream }) => {
  const [userMic, setUserMic] = useState(false);
  const [userVideo, setUserVideo] = useState(false);
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

  const handleCloseMeeting = () => {
    window.open("/", "_self");
  };

  return (
    <div className="fixed bottom-0 w-full">
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
  );
};

export default Controller;
