import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authReducer } from "./slices/authSlice";

const userPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["auth", "profile"],
};

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["posts"],
};

const rootReducer = combineReducers({
  auth: persistReducer(userPersistConfig, authReducer),
});
const reducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export default { store, persistor };
