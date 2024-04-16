import React, { useState, useRef } from "react";
import PrivatePath from "../auth/PrivatePath";
import { useSelector } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";

const Updatephoto = ({ setImg, public_id, operation }) => {
  const [profilephoto, setprofilephoto] = useState(null);
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
    const formdata = new FormData();
    formdata.append("profilephoto", profilephoto);
    await secureAxios
      .post("/api/user/updateprofilephoto", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        getuserdetails();
        inputFile.current.value = null;
        console.log(res.data.profilephoto.url);
        setImg(false);
      })
      .catch((err) => setImg(false));
  };

  const deletephoto = async function () {
    await secureAxios
      .post(`/api/user/deleteprofilephoto/${public_id}`)
      .then((res) => {
        getuserdetails();
        console.log(res.data.response);
        setImg(false);
      })
      .catch((err) => {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
        setImg(false);
      });
  };

  return (
    <div className="bg-white rounded-md px-5 py-3 flex gap-3">
      {operation === "update" && (
        <div className="">
          <input
            type="file"
            onChange={(e) => setprofilephoto(e.target.files[0])}
            ref={inputFile}
            accept="image/*"
            id="upload"
            className="hidden"
          />
          <label
            htmlFor="upload"
            className="bg-orange-900 px-2 py-1 rounded-md text-white mr-3 "
          >
            Upload Photo
          </label>
          <button onClick={upload} className="mt-0 bg-green-300 ">
            Update
          </button>
          <button onClick={() => setImg(false)} className="mt-0 bg-red-300 ">
            Cancel
          </button>
        </div>
      )}
      {operation === "delete" && (
        <div className="px-10 py-4 flex justify-between align-middle ">
          <div className="w-[50px] mr-10 h-[50px] rounded-full overflow-hidden text-black hover:cursor-pointer">
            <img
              src={userDetails?.profilephoto?.url ?? "/images/user.png"}
              alt="user photo"
              className="w-full h-full"
            />
          </div>
          <button onClick={deletephoto} className="mt-0 bg-green-300 ">
            Delete Photo
          </button>
          <button onClick={() => setImg(false)} className="mt-0 bg-red-300 ">
            Cancel
          </button>
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
