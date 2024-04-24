import React, { useState, useRef } from "react";
import PrivatePath from "../auth/PrivatePath";
import { useSelector } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";

const Updatephoto = ({ setImg, public_id, operation }) => {
  const [profilephoto, setprofilephoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputFile = useRef(null);
  const secureAxios = PrivatePath();
  const { userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getuserdetails = async () => {
    try {
      const res = await secureAxios.get("/api/user/me");
      dispatch(setUserDetails(res.data.user));
    } catch (err) {
      if (!err.response) {
        console.log("no server response");
      } else {
        console.log(err.response?.data);
      }
    }
  };

  const upload = async function () {
    if (!profilephoto) {
      setImg(false);
      return;
    }
    setLoading(true);
    const formdata = new FormData();
    formdata.append("profilephoto", profilephoto);

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
        console.log(res.data);
        setImg(false);
      })
      .catch((err) => {
        console.log(err);
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
      .post(`/api/user/deleteprofilephoto/${public_id}`)
      .then((res) => {
        getuserdetails();
        setLoading(false);
        setImg(false);
      })
      .catch((err) => {
        if (!err.response?.data) {
          console.log("no server response");
        } else {
          console.log(err.response.data);
        }
        setImg(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="">
      {operation === "update" && (
        <div className="border border-1 border-slate-600 bg-white flex flex-col justify-center items-center p-3 py-7 gap-7 rounded-md ">
          <div
            className="w-[100px] h-[100px] border border-1 border-slate-600 overflow-hidden hover:cursor-pointer "
            onClick={() => {
              inputFile.current.click();
            }}
          >
            {profilephoto ? (
              <img
                src={URL.createObjectURL(profilephoto)}
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
          {loading ? (
            <p className="text-center text-slate-800">
              ...processing your request
            </p>
          ) : (
            ""
          )}
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
          {loading ? (
            <p className="text-center text-slate-800">
              ...processing your request
            </p>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Updatephoto;

// const [files, setFiles] = useState([]);
// function handleMultipleChange(event) {
//   setFiles([...event.target.files]);
// }

// const formData = new FormData();
// files.forEach((file, index) => {
//   formData.append(`file${index}`, file);
// });
