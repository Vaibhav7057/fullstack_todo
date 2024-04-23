import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Unprotected = () => {
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.user);

  return !accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default Unprotected;
