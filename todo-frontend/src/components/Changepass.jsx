import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivatePath from "../auth/PrivatePath";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

const Changepass = () => {
  const [password, setPassword] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const secureAxios = PrivatePath();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    secureAxios
      .patch("/api/user/password/update", password, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setPassword({});
        navigate("/");
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response.data) {
          console.log("server is not responding");
          setErrMsg("server is not responding");
        } else {
          setErrMsg(err.message);
          console.log(err);
        }
      });
  };

  return (
    <section>
      <p className={errMsg ? "block" : "hidden"}>{errMsg}</p>
      <h1>Change your accout password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="oldPassword">Old Password:</label>
        <div>
          <input
            type={showOldPass ? "text" : "password"}
            id="oldPassword"
            name="oldPassword"
            value={password.oldPassword?.toString() || ""}
            onChange={handleChange}
            placeholder="Old Password"
            required
          />
          <span onClick={() => setShowOldPass((pre) => !pre)}>
            {showOldPass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>
        <label htmlFor="newPassword">New Password:</label>
        <div>
          <input
            type={showPass ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={password.newPassword?.toString() || ""}
            onChange={handleChange}
            placeholder="New Password"
            required
          />
          <span onClick={() => setShowPass((pre) => !pre)}>
            {showPass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <div>
          <input
            type={showConPass ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={password.confirmPassword?.toString() || ""}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <span onClick={() => setShowConPass((pre) => !pre)}>
            {showConPass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>
        <button>Update</button>
      </form>
      <button onClick={() => navigate(-1)}>Back</button>
    </section>
  );
};

export default Changepass;
