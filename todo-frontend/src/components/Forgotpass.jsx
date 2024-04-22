import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useEffect } from "react";

const Forgotpass = () => {
  const [data, setData] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    axios
      .post(`/api/user/password/${otpSent ? "reset" : "forgot"}`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setData({});
        setOtpSent(true);
        setLoading(false);
        if (otpSent) {
          navigate("/signin");
        }
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response.data) {
          setErrMsg("server is not responding");
        } else {
          setErrMsg(err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setErrMsg("");
  }, [data]);

  return (
    <div className="flex justify-center items-center flex-col">
      <h3 className="font-bold text-violet-300 text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      <p className={` text-yellow-300  ${errMsg ? "block" : "hidden"}`}>
        {errMsg}
      </p>
      {loading ? (
        <p className="text-center text-slate-300">...processing your request</p>
      ) : (
        ""
      )}
      <section className=" controldiv border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2 ">
        <h1 className="font-bold text-md text-indigo-950 my-4 ">
          Forgot password
        </h1>
        <form onSubmit={handleSubmit}>
          <p className={`text-sm mb-3 ${otpSent ? "block" : "hidden"}`}>
            OTP is valid only for 5 minutes
          </p>
          <label
            htmlFor={otpSent ? "resetPasswordOtp" : "email"}
            className="font-bold text-sm "
          >
            {otpSent ? "Enter OTP" : "Email"}:
          </label>
          <input
            type={otpSent ? "text" : "email"}
            className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
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
              <label htmlFor="newPassword" className="font-bold text-sm ">
                New Password:
              </label>
              <div className="flex bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
                <input
                  type={showPass ? "text" : "password"}
                  className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
                  id="newPassword"
                  name="newPassword"
                  value={data.newPassword?.toString() || ""}
                  onChange={handleChange}
                  placeholder="New Password"
                  required
                />
                <span
                  onClick={() => setShowPass((pre) => !pre)}
                  className="hover:cursor-pointer"
                >
                  {showPass ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
              <label htmlFor="confirmPassword" className="font-bold text-sm ">
                Confirm Password:
              </label>
              <div className="flex bg-white mb-4 items-center px-2 rounded-md border border-1 border-slate-400  ">
                <input
                  type={showConPass ? "text" : "password"}
                  className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={data.confirmPassword?.toString() || ""}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <span
                  onClick={() => setShowConPass((pre) => !pre)}
                  className="hover:cursor-pointer"
                >
                  {showConPass ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
            </>
          )}

          <button
            className={`${
              otpSent ? "bg-yellow-400" : "bg-green-200"
            }  rounded-md text-center w-full text-black font-medium my-3`}
          >
            {otpSent ? "Update" : "Request OTP"}
          </button>
        </form>
        <Link
          onClick={() => navigate(-1)}
          className="underline mt-3 block text-blue-700 pl-5 mb-4 "
        >
          back
        </Link>
      </section>
    </div>
  );
};

export default Forgotpass;
