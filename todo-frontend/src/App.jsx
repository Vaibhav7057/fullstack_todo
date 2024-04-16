import React from "react";
import { Route, Routes } from "react-router-dom";
import Todos from "./Todos";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PersistLogin from "./auth/PersistLogin.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import PagenotFound from "./pages/PagenotFound.jsx";
import Updatephoto from "./components/Updatephoto.jsx";
function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<Login />} />
      <Route element={<PersistLogin />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Todos />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/updatephoto" element={<Updatephoto />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/deletephoto/:public_id" element={<Updatephoto />} />
        </Route>
      </Route>
      <Route path="*" element={<PagenotFound />} />
    </Routes>
  );
}

export default App;
