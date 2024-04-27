import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivatePath from "../auth/PrivatePath";
import { useSelector } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
const DeleteAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const secureAxios = PrivatePath();
  const { userDetails } = useSelector((state) => state.user);
  const public_id = userDetails?.profilephoto?.public_id;
  const leave = () => {
    setLoading(true);
    secureAxios
      .delete(`/api/user/deleteaccount/?public_id=${public_id}`)
      .then((res) => {
        console.log(res.data);
        dispatch(setUserDetails(null));
        setLoading(false);
        navigate("/register");
      })
      .catch((err) => console.log(err.response))
      .finally(() => setLoading(false));
  };
  return (
    <div className="w-screen h-screen bg-[#011015] text-white flex justify-center items-center ">
      <div className="">
        {loading ? (
          <p>...processing your request</p>
        ) : (
          <p>Do you really want to delete your account?</p>
        )}

        <div className="text-center mt-5">
          <button
            className="bg-green-500 px-3 py-1 mr-3 rounded-md"
            onClick={leave}
          >
            Yes
          </button>
          <button
            className="bg-red-500 px-3 py-1 mr-3 rounded-md"
            onClick={() => navigate(-1)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
