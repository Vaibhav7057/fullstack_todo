import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { loginSuccess } from "../../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import Updatephoto from "../Updatephoto";

const Signup = () => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  async function registeruser(e) {
    e.preventDefault();

    await axios
      .post("/api/user/register", user)
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
      <form onSubmit={(e) => registeruser(e)}>
        <label htmlFor="fullname">Fullname</label>
        <br />
        <input
          type="text"
          name="fullName"
          value={user.fullName || ""}
          onChange={(e) =>
            setUser((pre) => ({ ...pre, fullName: e.target.value }))
          }
          id="fullname"
          placeholder="enter full name"
          required
        />
        <br />
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
          placeholder="enter your email"
          required
        />
        <br />
        <label htmlFor="monumber">Mobile Number</label>
        <br />
        <input
          type="text"
          placeholder="enter your mobile number"
          id="monumber"
          value={user.monumber || ""}
          onChange={(e) =>
            setUser((pre) => ({ ...pre, monumber: e.target.value }))
          }
          name="monumber"
        />{" "}
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          name="password"
          id="password"
          value={user.password || ""}
          onChange={(e) =>
            setUser((pre) => ({ ...pre, password: e.target.value }))
          }
          placeholder="create password"
          required
        />
        <br />
        <button>Create Account</button>
      </form>
      <p>
        Already have an account <NavLink to="/auth">Sign In</NavLink>{" "}
      </p>
      <Updatephoto />
    </div>
  );
};

export default Signup;
