import React from "react";

const Loader = () => {
  return (
    <div className="bg-[#011015] h-screen w-screen flex justify-center items-center ">
      <div className="relative flex justify-center items-center">
        <div className="ring w-[200px] h-[200px] "></div>
        <div className="ring w-[190px] h-[190px] "></div>
        <span className="text-white">...loading</span>
      </div>
    </div>
  );
};

export default Loader;
