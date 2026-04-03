// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Defaults to null, meaning no user is logged in
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // You can add actions here later to update the user
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
