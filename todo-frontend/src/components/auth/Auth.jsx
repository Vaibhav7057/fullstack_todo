import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Auth = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="">
      {isAuthenticated ? <Navigate replace to="/" /> : <Outlet />}
    </div>
  );
};

export default Auth;
