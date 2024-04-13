import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  userDetails: null,
  accessToken: null,
  persist: JSON.parse(localStorage.getItem("persist")) || false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.userDetails = null;
      state.accessToken = null;
      state.persist = false;
      state.error = null;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const { setAccessToken, logout, setUserDetails } = userSlice.actions;
export default userSlice.reducer;
