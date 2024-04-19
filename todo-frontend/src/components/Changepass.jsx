import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivatePath from "../auth/PrivatePath";

const Changepass = () => {
  const [password, setPassword] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const secureAxios = PrivatePath();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    secureAxios
      .patch("/api/user/password/update", password, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setPassword({});
        navigate("/");
      })
      .catch((error) => {
        const err = error.response.data;
        if (!error.response.data) {
          console.log("server is not responding");
          setErrMsg("server is not responding");
        } else {
          setErrMsg(err.message);
          console.log(err);
        }
      });
  };

  return (
    <section>
      <p className={errMsg ? "block" : "hidden"}>{errMsg}</p>
      <h1>Change your accout password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={password.oldPassword?.toString() || ""}
          onChange={handleChange}
          placeholder="Old Password"
          required
        />
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={password.newPassword?.toString() || ""}
          onChange={handleChange}
          placeholder="New Password"
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={password.confirmPassword?.toString() || ""}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        <button>Update</button>
      </form>
      <button onClick={() => navigate(-1)}>Back</button>
    </section>
  );
};

export default Changepass;
