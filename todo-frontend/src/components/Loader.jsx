import React from "react";

const Loader = () => {
  return (
    <div className="bg-[#011015] h-screen w-screen flex justify-center items-center ">
      <div className="relative flex justify-center items-center">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <span className="text-white">...loading</span>
      </div>
    </div>
  );
};

export default Loader;
