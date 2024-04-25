import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  userDetails: null,
  accessToken: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    userlogout: (state) => {
      state.userDetails = null;
      state.accessToken = undefined;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const { setAccessToken, userlogout, setUserDetails } = userSlice.actions;
export default userSlice.reducer;
