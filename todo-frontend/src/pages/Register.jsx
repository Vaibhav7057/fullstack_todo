import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
const Register = () => {
  const [errMsg, setErrMsg] = useState("");
  const [user, setUser] = useState({});
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
    axios
      .post("/api/user/register", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        setUser({});
        navigate("/signin");
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response) {
          setErrMsg("No Server Response");
        } else {
          setErrMsg(err);
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

  return (
    <div className="flex justify-center items-center flex-col ">
      <h3 className="font-bold text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      <section className="controldiv text-md pb-5 border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2 ">
        <p ref={errRef} className={errMsg ? "block" : "hidden"}>
          {errMsg}
        </p>
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
          <label htmlFor="email" className="font-bold text-sm ">
            Email:
          </label>
          <input
            type="email"
            className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
            id="email"
            autoComplete="off"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            placeholder="enter your email"
            required
          />
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

          <label htmlFor="password" className="font-bold text-sm ">
            Password:
          </label>
          <div className="flex bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
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
          </div>
          <button className="bg-yellow-400 rounded-md text-center w-full text-black font-medium my-4">
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
