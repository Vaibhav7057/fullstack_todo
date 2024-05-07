import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivatePath from "../auth/PrivatePath";
import { useSelector } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
import ServiceLoder from "../components/ServiceLoder";
import toast from "react-hot-toast";

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
        dispatch(setUserDetails(null));
        setLoading(false);
        toast.success("your account deleted successfully");
        navigate("/register");
      })
      .catch((error) => {
        const err = error.response?.data;
        if (!error.response) {
          toast.error("internal server error, sorry !");
        } else if (!err) {
          toast.error(error.response.statusText);
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="w-screen h-screen bg-[#011015] text-white flex justify-center items-center ">
      <div className="">
        {loading ? (
          <ServiceLoder text="...deleting your account, please wait" />
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
