import axios from "axios";
import { useSelector } from "react-redux";
import useRefresh from "./useRefresh";
import { useEffect } from "react";

const BASE_URL = "https://todobackend-3gdj.onrender.com";
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const PrivatePath = () => {
  const { accessToken } = useSelector((state) => state.user);
  const refresh = useRefresh();
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default PrivatePath;
