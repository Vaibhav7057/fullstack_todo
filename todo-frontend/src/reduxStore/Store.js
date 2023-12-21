import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice.js";
import todoReducer from "./Slices/todoSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    todo: todoReducer,
  },
  devTools: true,
});

export default store;
