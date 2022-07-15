import { configureStore } from "@reduxjs/toolkit";
import controlSlice from "./features/controlSlice";
import dataSlice from "./features/dataSlice";
const store = configureStore({
  reducer: {
    control: controlSlice,
    data: dataSlice,
  },
});

export default store;
