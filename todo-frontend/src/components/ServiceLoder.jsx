import React from "react";

const ServiceLoder = ({ text }) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center opacity-40 bg-[#00000057] backdrop-blur-md   ">
      <div className="flex flex-col justify-center items-center ">
        <div className="w-[50px] h-[50px] rounded-full border border-white border-b-slate-400 spinner "></div>
        <p className="text-center text-white mt-4">{text}</p>
      </div>
    </div>
  );
};

export default ServiceLoder;
