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
    <section>
      <p ref={errRef} className={errMsg ? "block" : "hidden"}>
        {errMsg}
      </p>
      <h1>Become a Member</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Fullname:</label>
        <input
          type="text"
          id="fullName"
          ref={nameRef}
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
        <button>Create Account</button>
      </form>
      <p>
        Already have Account?
        <br />
        <span className="line">
          <Link to="/signin">Login</Link>
        </span>
      </p>
    </section>
  );
};

export default Register;
