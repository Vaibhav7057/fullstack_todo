import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrivatePath from "../auth/PrivatePath";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../reduxStore/Slices/userSlice";
const Updateinfo = () => {
  const [user, setUser] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);

  const secureAxios = PrivatePath();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((pre) => ({ ...pre, [name]: value }));
  };
  useEffect(() => {
    setUser(userDetails);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    secureAxios
      .patch("/api/user/me/update", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setUser({});
        dispatch(setUserDetails(res.data.user));
        navigate("/");
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response.data) {
          console.log(err.response);
        } else {
          setErrMsg(err.message);
          console.log(err);
        }
      });
  };

  return (
    <div className="flex justify-center items-center flex-col ">
      <h3 className="font-bold text-2xl sm:text-[2.5vmax] my-7">
        Todo List App
      </h3>
      <section className="controldiv text-md pb-5 border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-2">
        <p className={errMsg ? "block" : "hidden"}>{errMsg}</p>
        <h1 className="font-bold text-xl  text-indigo-950 my-4 ">
          Update Your Details
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName" className="font-bold text-sm ">
            Fullname:
          </label>
          <input
            type="text"
            className="rounded-md px-2 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
            id="fullName"
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
          />
          <button className="bg-yellow-400 rounded-md text-center w-full text-black font-medium my-4">
            Update
          </button>
        </form>
        <button
          onClick={() => navigate(-1)}
          className="underline mt-3 block text-blue-700 pl-5 mb-4 "
        >
          back
        </button>
      </section>
    </div>
  );
};

export default Updateinfo;

// navigate("/login", { state: { from: location }, replace: true });
// const from = location.state?.from?.pathname || "/";
// navigate(from, { replace: true });
