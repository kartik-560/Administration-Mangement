// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // This hooks up the state.auth you are trying to access in the Sidebar
  },
});