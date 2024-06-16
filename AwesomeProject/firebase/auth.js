// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { auth } from "./config";

// export const registerDB = async ({ email, password }) => {
//   try {
//     const userCredentials = await createUserWithEmailAndPassword({
//       auth,
//       email,
//       password,
//     });
//     return userCredentials.user.uid;
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginDB = async ({ email, password }) => {
//   try {
//     const credentials = await signInWithEmailAndPassword(auth, email, password);
//     return credentials.user;
//   } catch (error) {
//     throw error;
//   }
// };
