import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../reduxStore/Slices/userSlice";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import axios from "../auth/baseaxios";

const Login = () => {
  const [persist, setPersist] = useState(false);
  const [user, setUser] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/user/login", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        const accessToken = res?.data?.token;
        dispatch(setAccessToken(accessToken));
        setUser({});
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response.data) {
          setErrMsg("No Server Response");
        } else {
          setErrMsg(err.message);
        }
      });
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user]);

  return (
    <div className="flex justify-center items-center flex-col ">
      <h3 className="font-bold text-violet-300 text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      <p className={`text-yellow-300   ${errMsg ? "block" : "hidden"}`}>
        {errMsg}
      </p>
      <section className="controldiv text-md pb-5 border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2 ">
        <h1 className="font-bold text-xl pl-7 text-indigo-950 my-4 ">
          Sign In
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="font-bold text-sm ">
            Email:
          </label>
          <input
            type="email"
            className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
            id="email"
            ref={emailRef}
            autoComplete="off"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            placeholder="enter your email"
            required
          />

          <label htmlFor="password" className="font-bold text-sm ">
            Password:
          </label>
          <div className="flex bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
            <input
              type={showPass ? "text" : "password"}
              className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm "
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
          </div>
          <button className="bg-yellow-400 rounded-md text-center w-full text-black font-medium my-4">
            Sign In
          </button>
          <div className="pl-4 flex items-center gap-2">
            <input
              type="checkbox"
              className="hover:cursor-pointer"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist" className="hover:cursor-pointer">
              Trust This Device
            </label>
          </div>
        </form>
        <div className="mt-3 flex justify-around">
          <p>Need an Account?</p>
          <Link to="/register" className="underline block text-blue-700 ">
            Sign Up
          </Link>
        </div>
        <Link
          to="/forgotpass"
          className="underline mt-3 block text-orange-700 pl-5 "
        >
          forgot password
        </Link>
      </section>
    </div>
  );
};

export default Login;
