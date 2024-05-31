import { createAsyncThunk } from "@reduxjs/toolkit";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const { name, email, password } = credentials;
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredentials.user, { displayName: name });
      const user = auth.currentUser;
      const dataUser = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        accessToken: user.stsTokenManager.accessToken,
      };

      return dataUser;
    } catch (error) {
      alert(`This email already used`);
    }
  }
);
