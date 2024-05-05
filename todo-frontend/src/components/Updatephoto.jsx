import React, { useState, useRef } from "react";
import PrivatePath from "../auth/PrivatePath";
import { useSelector } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
import ReactProfile, { ALL_FILTERS } from "react-profile";
import "react-profile/themes/default.min.css";
import ServiceLoder from "./ServiceLoder";
import toast from "react-hot-toast";

const Updatephoto = ({ setImg, public_id, operation }) => {
  const [profilephoto, setprofilephoto] = useState(null);
  const [croppedPhoto, setCroppedPhoto] = useState(null);
  const [showCropped, setShowCropped] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputFile = useRef(null);
  const secureAxios = PrivatePath();
  const { userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getuserdetails = async () => {
    try {
      const res = await secureAxios.get("/api/user/me");
      dispatch(setUserDetails(res.data.user));
    } catch (error) {
      const err = error.response?.data;
      if (!err) {
        toast.error(error.response.statusText);
      } else {
        toast.error(err.message);
      }
    }
  };

  const upload = async function () {
    if (!croppedPhoto) {
      setImg(false);
      return;
    }
    setLoading(true);
    const formdata = new FormData();
    formdata.append("profilephoto", croppedPhoto);

    formdata.append("public_id", userDetails.profilephoto?.public_id || "");
    await secureAxios
      .post("/api/user/updateprofilephoto", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        getuserdetails();
        inputFile.current.value = null;
        setLoading(false);
        toast.success("Profile photo changed successfully");
        setImg(false);
      })
      .catch((error) => {
        const err = error.response?.data;
        if (!err) {
          toast.error(error.response.statusText);
        } else {
          toast.error(err.message);
        }
        setImg(false);
      })
      .finally(() => setLoading(false));
  };

  const deletephoto = async function () {
    if (!userDetails?.profilephoto?.url) {
      setImg(false);
      return;
    }
    setLoading(true);
    await secureAxios
      .post("/api/user/deleteprofilephoto", { public_id: public_id })
      .then((res) => {
        getuserdetails();
        setLoading(false);
        toast.success("profile photo removed successfully");
        setImg(false);
      })
      .catch((error) => {
        const err = error.response?.data;
        if (!err) {
          toast.error(error.response.statusText);
        } else {
          toast.error(err.message);
        }
        setImg(false);
      })
      .finally(() => setLoading(false));
  };

  const handleCropComplete = async (exportObject) => {
    const blob = await exportObject.getBlob();
    const dataURL = exportObject.getDataURL();
    setCroppedPhoto(blob);
    setShowCropped(dataURL);
  };

  return (
    <div>
      {operation === "update" && (
        <div className="border border-1 border-slate-600 bg-white flex flex-col justify-center items-center p-3 py-7 gap-7 rounded-md ">
          {profilephoto && (
            <ReactProfile
              key={profilephoto.name}
              src={profilephoto}
              filters={ALL_FILTERS}
              square
              initCrop={{
                unit: "%",
                width: 50,
                height: 50,
                x: 25,
                y: 25,
              }}
              onDone={handleCropComplete}
            />
          )}
          <div
            className="border border-black p-1 rounded-md hover:cursor-pointer text-sm "
            onClick={() => {
              inputFile.current.click();
            }}
          >
            Select Photo
          </div>
          <div className="w-[100px] h-[100px] border border-1 border-slate-600 overflow-hidden hover:cursor-pointer ">
            {showCropped ? (
              <img
                src={showCropped}
                alt="profile photo"
                className="w-full h-full"
              />
            ) : (
              <img
                src={userDetails?.profilephoto?.url ?? "/images/user.png"}
                alt="profile photo"
                className="w-full h-full"
              />
            )}
          </div>
          <div className="bg-white rounded-md px-5 py-3 flex gap-3">
            <input
              type="file"
              onChange={(e) => {
                setprofilephoto(e.target.files[0]);
              }}
              ref={inputFile}
              accept="image/*"
              id="upload"
              className="hidden"
            />

            <button
              onClick={upload}
              className=" bg-green-300 px-3 py-2 rounded-md  mr-3 text-xs border border-1 border-slate-400 hover:text-white hover:bg-green-700 "
            >
              Update
            </button>
            <button
              onClick={() => setImg(false)}
              className=" bg-red-300 px-3 py-2 rounded-md  text-xs border border-1 border-slate-400 hover:text-white hover:bg-red-700 "
            >
              Cancel
            </button>
          </div>
          {loading ? <ServiceLoder text="...processing your request" /> : ""}
        </div>
      )}
      {operation === "delete" && (
        <div className="border border-1 border-slate-600 bg-white flex flex-col justify-center items-center p-3 py-7 gap-7 rounded-md ">
          <div className="w-[100px] h-[100px] border border-1 border-slate-600 overflow-hidden ">
            <img
              src={userDetails?.profilephoto?.url ?? "/images/user.png"}
              alt="profile photo"
              className="w-full h-full"
            />
          </div>
          <div className="bg-white rounded-md px-5 py-3 flex gap-3">
            <button
              onClick={deletephoto}
              className=" bg-green-300 px-3 py-2 rounded-md  mr-3 text-xs border border-1 border-slate-400 hover:text-white hover:bg-green-700 "
            >
              Remove
            </button>
            <button
              onClick={() => setImg(false)}
              className=" bg-red-300 px-3 py-2 rounded-md  text-xs border border-1 border-slate-400 hover:text-white hover:bg-red-700 "
            >
              Cancel
            </button>
          </div>
          {loading ? <ServiceLoder text="...processing your request" /> : ""}
        </div>
      )}
    </div>
  );
};

export default Updatephoto;
