import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import useRefresh from "./useRefresh";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, persist } = useSelector((state) => state.user);
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

    !accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <div>
      {!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}
    </div>
  );
};

export default PersistLogin;
