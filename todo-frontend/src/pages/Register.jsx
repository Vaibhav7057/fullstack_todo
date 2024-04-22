import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import { FaTimesCircle } from "react-icons/fa";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const [errMsg, setErrMsg] = useState("");
  const [user, setUser] = useState({});
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const nameRef = useRef();
  const errRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v1 = EMAIL_REGEX.test(user?.email);
    const v2 = PWD_REGEX.test(user?.password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    axios
      .post("/api/user/register", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setUser({});
        navigate("/signin");
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response.data) {
          setErrMsg("No Server Response");
        } else {
          setErrMsg(err.message);
        }
        errRef.current.focus();
      });
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(user?.email));
  }, [user?.email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(user?.password));
  }, [user?.password]);

  return (
    <div className="flex justify-center items-center flex-col ">
      <h3 className="font-bold text-violet-300 text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      <p className={` text-yellow-300  ${errMsg ? "block" : "hidden"}`}>
        {errMsg}
      </p>
      <section className="controldiv text-md pb-5 border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2 ">
        <h1 className="font-bold text-xl  text-indigo-950 my-4 ">
          Become a Member
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName" className="font-bold text-sm ">
            Fullname:
          </label>
          <input
            type="text"
            className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
            id="fullName"
            ref={nameRef}
            autoComplete="off"
            name="fullName"
            value={user.fullName || ""}
            onChange={handleChange}
            placeholder="enter your fullname"
            required
          />
          <label htmlFor="email" className="font-bold text-sm flex gap-3">
            Email:
            <AiOutlineCheck
              style={{
                color: "#13f50f",
              }}
              className={validEmail ? "inline-block" : "hidden"}
            />
            <FaTimesCircle
              style={{
                color: "#f50f0f",
              }}
              className={validEmail || !user?.email ? "hidden" : "inline-block"}
            />
          </label>
          <div className="relative">
            <input
              type="email"
              className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
              id="email"
              autoComplete="off"
              name="email"
              value={user.email?.toLowerCase() || ""}
              onChange={handleChange}
              placeholder="enter your email"
              required
            />
            <p
              className={`absolute left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                !validEmail && user?.email ? "block" : "hidden"
              }`}
            >
              <BsFillInfoCircleFill className="inline mr-3" />
              Please enter a valid email address.
            </p>
          </div>
          <label htmlFor="monumber" className="font-bold text-sm ">
            Mobile Number:
          </label>
          <input
            type="text"
            className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
            id="monumber"
            autoComplete="off"
            name="monumber"
            value={user.monumber?.toString() || ""}
            onChange={handleChange}
            placeholder="enter mobile number"
            required
          />

          <label htmlFor="password" className="font-bold text-sm flex gap-3">
            Password:
            <AiOutlineCheck
              style={{
                color: "#13f50f",
              }}
              className={validPassword ? "inline-block " : "hidden"}
            />
            <FaTimesCircle
              style={{
                color: "#f50f0f",
              }}
              className={
                validPassword || !user?.password ? "hidden" : "inline-block"
              }
            />
          </label>
          <div className="flex relative bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
            <input
              type={showPass ? "text" : "password"}
              className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
              id="password"
              name="password"
              value={user.password?.toString() || ""}
              onChange={handleChange}
              placeholder="enter your account password"
              required
            />
            <span
              onClick={() => setShowPass((pre) => !pre)}
              className="hover:cursor-pointer"
            >
              {showPass ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
            <p
              className={`absolute left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                !validPassword && user?.password ? "block" : "hidden"
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
          </div>
          <button
            disabled={!validEmail || !validPassword ? true : false}
            className={` rounded-md text-center w-full text-black font-medium my-4 ${
              !validEmail || !validPassword ? "bg-slate-300" : "bg-yellow-400"
            }`}
          >
            Create Account
          </button>
        </form>
        <div className="mt-3 flex justify-around">
          <p>Already have Account?</p>
          <Link to="/signin" className="underline block text-blue-700 ">
            Login
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Register;
