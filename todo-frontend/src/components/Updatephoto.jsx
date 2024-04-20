import React, { useState, useRef } from "react";
import PrivatePath from "../auth/PrivatePath";
import { useSelector } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
import { AiOutlineCloudUpload } from "react-icons/ai";

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
        setImg(false);
      })
      .catch((err) => setImg(false))
      .finally(() => setLoading(false));
  };

  const deletephoto = async function () {
    setLoading(true);
    await secureAxios
      .post(`/api/user/deleteprofilephoto/${public_id}`)
      .then((res) => {
        getuserdetails();
        setLoading(false);
        setImg(false);
      })
      .catch((err) => {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
        setImg(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="">
      {operation === "update" && (
        <>
          <div className="bg-white rounded-md px-5 py-3 flex gap-3">
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
              className="bg-orange-900 px-3 py-2 rounded-md text-white mr-3 text-xs hover:cursor-pointer flex justify-center items-center gap-2 "
            >
              <span>
                <AiOutlineCloudUpload />
              </span>
              Add Photo
            </label>
            <button
              onClick={upload}
              className=" bg-green-300 px-3 py-2 rounded-md  mr-3 text-xs "
            >
              Update
            </button>
            <button
              onClick={() => setImg(false)}
              className=" bg-red-300 px-3 py-2 rounded-md  text-xs"
            >
              Cancel
            </button>
          </div>
          {loading ? (
            <p className="text-center text-yellow-300">
              ...processing your request
            </p>
          ) : (
            ""
          )}
        </>
      )}
      {operation === "delete" && (
        <>
          <div className="px-10 py-4 bg-white rounded-md flex justify-between items-center ">
            <div className="w-[50px] mr-10 h-[50px] rounded-full overflow-hidden text-black hover:cursor-pointer">
              <img
                src={userDetails?.profilephoto?.url ?? "/images/user.png"}
                alt="user photo"
                className="w-full h-full"
              />
            </div>
            <button
              onClick={deletephoto}
              className="mt-0 bg-green-300 px-3 py-2 rounded-md  mr-3 text-xs"
            >
              Delete Photo
            </button>
            <button
              onClick={() => setImg(false)}
              className="mt-0 bg-red-300 px-3 py-2 rounded-md  mr-3 text-xs"
            >
              Cancel
            </button>
          </div>
          {loading ? (
            <p className="text-center text-yellow-300">
              ...processing your request
            </p>
          ) : (
            ""
          )}
        </>
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
