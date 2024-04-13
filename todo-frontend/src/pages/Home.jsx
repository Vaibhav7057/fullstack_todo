import React from "react";
import useLogout from "../auth/useLogout";
import PrivatePath from "../auth/PrivatePath";
const Home = () => {
  const logout = useLogout();
  const secureAxios = PrivatePath();
  const fetchUserInfo = async () => {
    try {
      const res = await secureAxios.get("/api/user/me");
      if (res.data?.success) {
        console.log(res.data.user);
      }
    } catch (err) {
      if (!err.response) {
        console.log("no server response");
      } else {
        console.log(err.response?.data);
      }
    }
  };

  return (
    <div>
      <h3>Vaibhav Gedam is the best person</h3>

      <button onClick={fetchUserInfo}>Get your details</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Home;
