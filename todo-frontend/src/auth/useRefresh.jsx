import axios from "axios";
import { setAccessToken } from "../reduxStore/Slices/userSlice";
import { useDispatch } from "react-redux";

const useRefresh = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axios.get("/api/user/refresh", {
        withCredentials: true,
      });
      const accessToken = response?.data?.token;
      dispatch(setAccessToken(accessToken));
      return accessToken;
    } catch (error) {
      if (!error.response) {
        console.log(error.message);
      }
      console.log(error.response?.data);
    }
  };
  return refresh;
};

export default useRefresh;
