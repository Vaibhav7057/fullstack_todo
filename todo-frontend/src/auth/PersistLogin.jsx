import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import useRefresh from "./useRefresh";
import Loader from "../components/Loader";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useSelector((state) => state.user);
  const persist = localStorage.getItem("persist") || false;

  const refresh = useRefresh();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err.message);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    persist && !accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <div>{!persist ? <Outlet /> : isLoading ? <Loader /> : <Outlet />}</div>
  );
};

export default PersistLogin;
