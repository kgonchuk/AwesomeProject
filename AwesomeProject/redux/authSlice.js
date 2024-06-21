// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: {
//     displayName: null,
//     photoURL: null,
//     email: null,
//     uid: null,
//     posts: [{ description: "" }],
//   },
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     register(state, action) {
//       state.user = action.payload;
//     },
//     logIn(state, action) {
//       state.user = action.payload;
//     },
//     logOut(state, action) {
//       state.user = {
//         photoURL: null,
//         displayName: null,
//         email: null,
//         uid: null,
//       };
//     },
//   },
// });

// export const { register, logIn, logOut } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const state = {
  name: null,
  email: null,
  avatar: null,
  userId: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      name: payload.name,
      email: payload.email,
      userId: payload.userId,
      avatar: payload.avatar,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authLogOut: () => state,
  },
});

export const authReducer = authSlice.reducer;
export const { updateUserProfile, authStateChange, authLogOut } =
  authSlice.actions;
