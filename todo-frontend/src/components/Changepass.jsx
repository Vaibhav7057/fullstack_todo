import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PrivatePath from "../auth/PrivatePath";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useEffect } from "react";
import ServiceLoder from "./ServiceLoder";
import toast from "react-hot-toast";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Changepass = () => {
  const [password, setPassword] = useState({});
  const [validPassword, setValidPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const navigate = useNavigate();

  const secureAxios = PrivatePath();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v1 = PWD_REGEX.test(password?.newPassword);
    const v2 = password?.newPassword === password?.confirmPassword;
    if (!v1 || !v2) {
      toast.error("Invalid Entry");
      return;
    }
    setLoading(true);
    secureAxios
      .patch("/api/user/password/update", password, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setPassword({});
        setLoading(false);
        toast.success("password changed successfully");
        navigate("/");
      })
      .catch((error) => {
        const err = error.response.data;
        if (!err) {
          toast.error(error.response.statusText);
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password?.newPassword));
    setValidMatch(password?.newPassword === password?.confirmPassword);
  }, [password?.newPassword, password?.confirmPassword]);

  return (
    <div className="flex justify-center items-center flex-col ">
      <h3 className="font-bold text-violet-300 text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      {loading ? <ServiceLoder text="...changing your password" /> : ""}
      <section className=" border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2  ">
        <h1 className="font-bold text-md text-indigo-950 my-4 ">
          Change your account password
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="oldPassword" className="font-bold text-sm">
            Old Password:
          </label>
          <div className="flex bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
            <input
              className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
              type={showOldPass ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={password.oldPassword?.toString() || ""}
              onChange={handleChange}
              placeholder="Old Password"
              required
            />
            <span
              onClick={() => setShowOldPass((pre) => !pre)}
              className="hover:cursor-pointer"
            >
              {showOldPass ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>
          <label htmlFor="newPassword" className="font-bold text-sm">
            New Password:
          </label>
          <div className="flex relative bg-white items-center mb-4 px-2 rounded-md border border-1 border-slate-400  ">
            <input
              type={showPass ? "text" : "password"}
              className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
              id="newPassword"
              name="newPassword"
              value={password.newPassword?.toString() || ""}
              onChange={handleChange}
              placeholder="New Password"
              required
            />
            <p
              className={`absolute z-10 left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                !validPassword && password?.newPassword ? "block" : "hidden"
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
          <div className="flex relative bg-white items-center px-2 rounded-md border border-1 border-slate-400 ">
            <input
              type={showConPass ? "text" : "password"}
              className="outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
              id="confirmPassword"
              name="confirmPassword"
              value={password.confirmPassword?.toString() || ""}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <p
              className={`absolute left-0 top-7 bg-black text-white text-xs font-extralight rounded-md p-2 ${
                !validMatch && password?.confirmPassword ? "block" : "hidden"
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
          <button className="bg-yellow-400 rounded-md text-center w-full text-black font-medium mt-4">
            Update
          </button>
        </form>
        <Link
          onClick={() => navigate(-1)}
          className="underline mt-3 block text-blue-700 mb-4 pl-5 "
        >
          back
        </Link>
      </section>
    </div>
  );
};

export default Changepass;
