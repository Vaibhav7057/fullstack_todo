import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

const Forgotpass = () => {
  const [data, setData] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/user/password/${otpSent ? "reset" : "forgot"}`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setData({});
        setOtpSent(true);
        if (otpSent) {
          navigate("/signin");
        }
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
      <h1>Forgot password</h1>
      <form onSubmit={handleSubmit}>
        <p className={errMsg ? "block" : "hidden"}>{errMsg}</p>
        <p className={otpSent ? "block" : "hidden"}>
          OTP is valid only for 5 minutes
        </p>
        <label htmlFor={otpSent ? "resetPasswordOtp" : "email"}>
          {otpSent ? "Enter OTP" : "Email"}:
        </label>
        <input
          type={otpSent ? "text" : "email"}
          id={otpSent ? "resetPasswordOtp" : "email"}
          name={otpSent ? "resetPasswordOtp" : "email"}
          value={otpSent ? data.resetPasswordOtp || "" : data.email || ""}
          onChange={handleChange}
          placeholder={
            otpSent ? "enter OTP sent to your Email" : "Enter your email"
          }
          required
        />
        {otpSent && (
          <>
            <label htmlFor="newPassword">New Password:</label>
            <div>
              <input
                type={showPass ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={data.newPassword?.toString() || ""}
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
                value={data.confirmPassword?.toString() || ""}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              <span onClick={() => setShowConPass((pre) => !pre)}>
                {showConPass ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
          </>
        )}

        <button>{otpSent ? "Update" : "Request OTP"}</button>
      </form>
      <button onClick={() => navigate(-1)}>Back</button>
    </section>
  );
};

export default Forgotpass;
