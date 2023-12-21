import React from "react";
import { Route, Routes } from "react-router-dom";
import Todos from "./Todos";
import Auth from "./components/auth/Auth.jsx";
import Signup from "./components/auth/Signup.jsx";
import Signin from "./components/auth/Signin.jsx";
import PagenotFound from "./components/PagenotFound";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Todos />} />
        <Route path="/auth" element={<Auth />}>
          <Route path="" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="*" element={<PagenotFound />} />
      </Routes>
    </div>
  );
}

export default App;
