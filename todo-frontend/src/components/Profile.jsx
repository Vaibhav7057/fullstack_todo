import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Updatephoto from "./Updatephoto";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userlogout } from "../reduxStore/Slices/userSlice";
import PrivatePath from "../auth/PrivatePath";

const Profile = () => {
  const [showmenu, setShowmenu] = useState(false);
  const [img, setImg] = useState(false);
  const [operation, setOperation] = useState("delete");
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const public_id = userDetails?.profilephoto?.public_id;
  const navigate = useNavigate();
  const menuref = useRef();
  const secureAxios = PrivatePath();

  async function logout() {
    try {
      const res = await secureAxios.get("/api/user/logout");
      if (res.data?.success) {
        dispatch(userlogout());
        localStorage.setItem("persist", false);
        navigate("/signin");
      }
    } catch (err) {
      if (!err.response) {
        console.log("no server response");
      } else {
        console.log(err.response?.data);
      }
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (!menuref.current.contains(e.target)) {
        setShowmenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div>
      {img && (
        <div className="absolute inset-0 bg-[#24212157] w-[100vw] h-[100vh] flex justify-center items-center backdrop-blur-sm min-w-full z-10">
          <Updatephoto
            setImg={setImg}
            public_id={public_id}
            operation={operation}
          />
        </div>
      )}
      <div className="relative ">
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
          ref={menuref}
          className={`min-w-[110px] absolute top-14 left-0 p-2 text-sm font-medium space-y-1 bg-slate-300 shadow-2xl ${
            showmenu ? "block" : "hidden"
          } `}
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
    </div>
  );
};

export default Profile;
