import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import axios from "axios";
import { useEffect } from "react";
import ServiceLoder from "./ServiceLoder";
import toast from "react-hot-toast";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Forgotpass = () => {
  const [data, setData] = useState({});
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
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
    if (!otpSent) {
      const v1 = EMAIL_REGEX.test(data?.email);
      if (!v1) {
        toast.error("Invalid Entry");
        return;
      }
    }
    if (otpSent) {
      const v1 = PWD_REGEX.test(data?.newPassword);
      const v2 = data?.newPassword === data?.confirmPassword;
      if (!v1 || !v2) {
        toast.error("Invalid Entry");
        return;
      }
    }
    axios
      .post(`/api/user/password/${otpSent ? "reset" : "forgot"}`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setData({});
        setOtpSent(true);
        setLoading(false);
        toast.success(
          otpSent
            ? "password changed successfully"
            : "otp sent to your registered email id"
        );
        if (otpSent) {
          navigate("/signin");
        }
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

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(data?.newPassword));
    setValidMatch(data?.newPassword === data?.confirmPassword);
  }, [data?.newPassword, data?.confirmPassword]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(data?.email));
  }, [data?.email]);

  return (
    <div className="flex justify-center items-center flex-col">
      <h3 className="font-bold text-violet-300 text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      {loading ? <ServiceLoder text="...processing your request" /> : ""}
      <section className=" min-w-[300px] border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2 ">
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
          <div className="relative">
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
              autoComplete="off"
              required
            />
            {!otpSent && (
              <p
                className={`absolute left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                  !validEmail && data?.email ? "block" : "hidden"
                }`}
              >
                <BsFillInfoCircleFill className="inline mr-3" />
                Please enter a valid email address.
              </p>
            )}
          </div>
          {otpSent && (
            <>
              <label htmlFor="newPassword" className="font-bold text-sm ">
                New Password:
              </label>
              <div className="flex relative bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
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
                <p
                  className={`absolute z-10 left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                    !validPassword && data?.newPassword ? "block" : "hidden"
                  }`}
                >
                  <BsFillInfoCircleFill className="inline mr-3" />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters : ! @ # $ %
                </p>
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
              <div className="flex relative bg-white mb-4 items-center px-2 rounded-md border border-1 border-slate-400  ">
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
                <p
                  className={`absolute left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                    !validMatch && data?.confirmPassword ? "block" : "hidden"
                  }`}
                >
                  <BsFillInfoCircleFill className="inline mr-3" />
                  Must match the first password input field.
                </p>
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
