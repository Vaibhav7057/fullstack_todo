import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { loginSuccess } from "../../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const Signin = () => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  function loginuser(e) {
    e.preventDefault();
    axios
      .post("/api/user/login", user)
      .then((res) => {
        dispatch(loginSuccess(res.data.data));
        setUser({});
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div>
      <form onSubmit={(e) => loginuser(e)}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          name="email"
          value={user.email || ""}
          onChange={(e) =>
            setUser((pre) => ({ ...pre, email: e.target.value }))
          }
          id="email"
          placeholder="enter your email or mobile number"
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          name="password"
          value={user.password || ""}
          onChange={(e) =>
            setUser((pre) => ({ ...pre, password: e.target.value }))
          }
          id="password"
          placeholder="create password"
          required
        />
        <br />

        <button>Log In</button>
      </form>
      <p>
        Don't have an account <NavLink to="/auth/signup">Sign Up</NavLink>{" "}
      </p>
    </div>
  );
};

export default Signin;
