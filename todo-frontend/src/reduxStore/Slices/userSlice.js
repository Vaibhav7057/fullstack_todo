import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  user: {},
  isAuthenticated: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFail: (state, action) => {
      state.error = action.payload;
      state.user = {};
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, loginFail } = userSlice.actions;
export default userSlice.reducer;
