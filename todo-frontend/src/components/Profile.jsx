import React, { useState } from "react";
import { useSelector } from "react-redux";
import useLogout from "../auth/useLogout";

const Profile = () => {
  const logout = useLogout();
  const [showmenu, setShowmenu] = useState(false);
  const { userDetails } = useSelector((state) => state.user);

  return (
    <div className="w-[250px] relative ">
      <div
        className="w-[50px] rounded-full overflow-hidden text-black hover:cursor-pointer "
        onClick={(e) => setShowmenu((prev) => !prev)}
      >
        <img
          src={userDetails?.profilephoto ?? "/images/user.png"}
          alt="user photo"
        />
      </div>
      <ul
        className={`absolute top-8 left-0 p-2 text-sm bg-slate-400 border border-1 border-black ${
          showmenu ? "block" : "hidden"
        }  `}
      >
        <li>Update Photo</li>
        <li>Update Password</li>
        <li>Change Password</li>
        <li>Update Info</li>
        <li>
          {" "}
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
