import React, { useState, useRef } from "react";
import axios from "axios";
import { loginSuccess } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";

const Updatephoto = () => {
  const [profilephoto, setprofilephoto] = useState(null);
  const [data, setData] = useState(null);
  const inputFile = useRef(null);
  const dispatch = useDispatch();
  // const [files, setFiles] = useState([]);
  // function handleMultipleChange(event) {
  //   setFiles([...event.target.files]);
  // }
  const upload = async function () {
    console.log(profilephoto);
    const formdata = new FormData();
    formdata.append("profilephoto", profilephoto);
    // const formData = new FormData();
    // files.forEach((file, index) => {
    //   formData.append(`file${index}`, file);
    // });
    await axios
      .post("/api/user/updateprofilephoto", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        inputFile.current.value = null;
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setprofilephoto(e.target.files[0])}
        ref={inputFile}
        accept="image/*"
      />
      <button onClick={upload}>Update</button>
      <img
        src={data?.url ?? "public/images/user.png"}
        alt="profile photo"
        width="50px"
      />
    </div>
  );
};

export default Updatephoto;
