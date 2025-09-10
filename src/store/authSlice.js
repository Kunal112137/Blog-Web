// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.status = true;
      state.userData = action.payload; // payload is the user object
    },
    logout(state) {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

// ✅ Selectors
export const selectUserData = (state) => state.auth.userData;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
