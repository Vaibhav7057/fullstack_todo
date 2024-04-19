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
    <section>
      <p className={errMsg ? "block" : "hidden"}>{errMsg}</p>
      <h1>Update Your Details</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Fullname:</label>
        <input
          type="text"
          id="fullName"
          autoComplete="off"
          name="fullName"
          value={user.fullName || ""}
          onChange={handleChange}
          placeholder="enter your fullname"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          autoComplete="off"
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          placeholder="enter your email"
          required
        />
        <label htmlFor="monumber">Mobile Number:</label>
        <input
          type="text"
          id="monumber"
          autoComplete="off"
          name="monumber"
          value={user.monumber?.toString() || ""}
          onChange={handleChange}
          placeholder="enter mobile number"
        />
        <button>Update</button>
      </form>
      <button onClick={() => navigate(-1)}>Back</button>
    </section>
  );
};

export default Updateinfo;

// navigate("/login", { state: { from: location }, replace: true });
// const from = location.state?.from?.pathname || "/";
// navigate(from, { replace: true });
