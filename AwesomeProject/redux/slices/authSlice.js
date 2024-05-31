import { createSlice } from "@reduxjs/toolkit";
import { register } from "../operation";

const authSlice = createSlice({
  name: `auth`,
  initialState: {
    user: { name: null, email: null, userId: null },
    token: null,
    isLoggedIn: false,
    isRefreshing: false,
    isLoading: false,
    error: null,
  },

  extraReducers: (builder) =>
    builder.addCase(register.fulfilled, (state, action) => {
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      state.token = action.payload.accessToken;
      state.isLoggedIn = true;
      state.user.userId = action.payload.uid;
      state.isLoading = false;
    }),
});

export const authReducer = authSlice.reducer;
