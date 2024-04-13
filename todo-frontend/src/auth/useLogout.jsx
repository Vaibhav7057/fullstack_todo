import React from "react";
import PrivatePath from "./PrivatePath";
import { useNavigate } from "react-router-dom";
import { logout } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
const useLogout = () => {
  const secureAxios = PrivatePath();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signOut = async () => {
    try {
      const res = await secureAxios.get("/api/user/logout");
      if (res.data?.success) {
        dispatch(logout());
        navigate("/signin");
      }
    } catch (err) {
      if (!err.response) {
        console.log("no server response");
      } else {
        console.log(err.response?.data);
      }
    }
  };
  return signOut;
};

export default useLogout;
