import React, { useState } from "react";
import axios from "axios";
import { loginSuccess } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";

const Updatephoto = () => {
  const [profilephoto, setprofilephoto] = useState();
  const upload = () => {
    const dispatch = useDispatch();
    let formData = new FormData();
    formData.append("profilephoto", profilephoto);
    formData.append("id", "6583409d3063187719ad4a8e");
    axios
      .post("/api/user/updateprofilephoto", formData)
      .then((res) => {
        dispatch(loginSuccess(res.data.data));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input type="file" onChange={(e) => setprofilephoto(e.target.files[0])} />
      <button onClick={upload}>Update</button>
    </div>
  );
};

export default Updatephoto;
