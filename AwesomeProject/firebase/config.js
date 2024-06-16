import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4Y-CXtTha2pR3UAQ8iL9QkLaFSsWnCuk",
  authDomain: "awesomeproject-59eb8.firebaseapp.com",
  projectId: "awesomeproject-59eb8",
  storageBucket: "awesomeproject-59eb8.appspot.com",
  messagingSenderId: "453360138418",
  appId: "1:453360138418:web:043d8de110933e3814f1ab",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
