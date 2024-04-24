import React from "react";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Todos from "./Todos";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PersistLogin from "./auth/PersistLogin.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Unprotected from "./auth/Unprotected.jsx";
import PagenotFound from "./pages/PagenotFound.jsx";
import Updatephoto from "./components/Updatephoto.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";
import Updateinfo from "./pages/Updateinfo.jsx";
import Changepass from "./components/Changepass.jsx";
import Forgotpass from "./components/Forgotpass.jsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && document.activeElement === document.body) {
        event.preventDefault();
        const typedUrl = document.location.href;
        navigate(typedUrl);
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route element={<Unprotected />}>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/forgotpass" element={<Forgotpass />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Todos />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/updatephoto" element={<Updatephoto />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/deletephoto/:public_id" element={<Updatephoto />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/deleteaccount" element={<DeleteAccount />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/updateinfo" element={<Updateinfo />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/changepass" element={<Changepass />} />
        </Route>
      </Route>
      <Route path="*" element={<PagenotFound />} />
    </Routes>
  );
}

export default App;
