import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
