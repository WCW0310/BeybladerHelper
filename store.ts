import { configureStore } from "@reduxjs/toolkit";
import indexSlice from "./slice/indexSlice";

export const store = configureStore({
  reducer: {
    index: indexSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;