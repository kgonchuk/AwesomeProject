import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5NFtuhk3NNOlmuFxBrcp-VkX0acDO0UQ",
  authDomain: "awesomeproject-8df53.firebaseapp.com",
  projectId: "awesomeproject-8df53",
  storageBucket: "awesomeproject-8df53.appspot.com",
  messagingSenderId: "1098923857268",
  appId: "1:1098923857268:web:6b9f02c9dddcc0a4a80821",
  measurementId: "G-3T222LZX7N",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
