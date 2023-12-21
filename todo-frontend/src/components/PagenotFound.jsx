import React from "react";
import { Link } from "react-router-dom";
const PagenotFound = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-yellow-300 text-black font-bold  ">
      <div className="flex  flex-col items-center">
        <p className="text-[2vmax]">404 Page not found</p>
        <Link to="/" className="underline">
          Go to home page
        </Link>
      </div>
    </div>
  );
};

export default PagenotFound;
