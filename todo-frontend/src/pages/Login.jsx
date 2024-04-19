import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../reduxStore/Slices/userSlice";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

const Login = () => {
  const [persist, setPersist] = useState(false);
  const [user, setUser] = useState({});
  const [showPass, setShowPass] = useState(false);
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
        if (!error.response) {
          setErrMsg("No Server Response");
        } else {
          console.log(err);
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

  return (
    <section>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          ref={emailRef}
          autoComplete="off"
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          placeholder="enter your email"
          required
        />

        <label htmlFor="password">Password:</label>
        <div>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            name="password"
            value={user.password?.toString() || ""}
            onChange={handleChange}
            placeholder="enter your account password"
            required
          />
          <span onClick={() => setShowPass((pre) => !pre)}>
            {showPass ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>
        <button>Sign In</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist">Trust This Device</label>
        </div>
      </form>
      <p>
        Need an Account?
        <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
      <span className="line">
        <Link to="/forgotpass">forgot password</Link>
      </span>
    </section>
  );
};

export default Login;
