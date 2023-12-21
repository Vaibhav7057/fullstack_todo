import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginFail } from "../reduxStore/Slices/userSlice";

const Profile = () => {
  const { user, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //   const imglink = user?.profilephoto.url;

  function logout() {
    axios
      .get("/api/user/logout")
      .then((res) => {
        console.log(res.data);
        dispatch(loginFail());
      })
      .catch((err) => console.log(err));
  }
  return (
    <div>
      <div className="w-[250px]">
        <div className="w-[40px] rounded-full overflow-hidden">
          {user && <img src="" alt="user photo" />}
        </div>
        <Link>Update Photo</Link>
        <Link>Update Password</Link>
        <Link>Change Password</Link>
        <Link>Update Info</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
