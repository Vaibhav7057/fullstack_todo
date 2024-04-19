import React, { useState } from "react";
import { useSelector } from "react-redux";
import useLogout from "../auth/useLogout";
import Updatephoto from "./Updatephoto";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const logout = useLogout();
  const [showmenu, setShowmenu] = useState(false);
  const [img, setImg] = useState(false);
  const [operation, setOperation] = useState("delete");
  const { userDetails } = useSelector((state) => state.user);
  const public_id = userDetails?.profilephoto?.public_id;
  const navigate = useNavigate();
  return (
    <div className={`w-[250px] ${img ? "" : "relative"} `}>
      {img && (
        <div className="absolute inset-0 bg-[#24212157] w-[100vw] h-[100vh] flex justify-center items-center backdrop-blur-sm min-w-full z-10">
          <Updatephoto
            setImg={setImg}
            public_id={public_id}
            operation={operation}
          />
        </div>
      )}
      <div
        className="w-[50px] h-[50px] rounded-full overflow-hidden text-black hover:cursor-pointer"
        onClick={(e) => setShowmenu((prev) => !prev)}
      >
        <img
          src={userDetails?.profilephoto?.url ?? "/images/user.png"}
          alt="user photo"
          className="w-full h-full"
        />
      </div>
      <ul
        className={` absolute top-8 left-0 p-2 text-[15px] space-y-1 bg-slate-300 shadow-2xl ${
          showmenu ? "block" : "hidden"
        }  `}
      >
        <li
          className="hover:cursor-pointer hover:text-white hover hover:bg-slate-800 "
          onClick={() => {
            setOperation("update");
            setShowmenu(false);
            setImg(true);
          }}
        >
          Update Photo
        </li>
        <li
          className="hover:cursor-pointer hover:text-white hover hover:bg-slate-800 "
          onClick={() => {
            setOperation("delete");
            setShowmenu(false);
            setImg(true);
          }}
        >
          Remove Photo
        </li>
        <li
          className="hover:cursor-pointer hover:text-white hover hover:bg-slate-800 "
          onClick={() => navigate("/changepass")}
        >
          Change Password
        </li>
        <li
          className="hover:cursor-pointer hover:text-white hover hover:bg-slate-800 "
          onClick={() => navigate("/updateinfo")}
        >
          Update Info
        </li>
        <li
          className="hover:cursor-pointer hover:text-white hover hover:bg-slate-800 "
          onClick={() => navigate("/deleteaccount")}
        >
          Delete Account
        </li>
        <li
          className="hover:cursor-pointer hover:text-white hover hover:bg-slate-800 "
          onClick={logout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Profile;
