import { createSlice } from "@reduxjs/toolkit";

// creating a controlSlice that is used to control the behaviour of
// loading overlay, receipt and error modals as they need to be called
// from multiple places

const controlSlice = createSlice({
  name: "control",
  initialState: {
    loading: false,
    receiptOpen: false,
    errorOpen: false,
    waitingForInput: false,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    startWaitingForInput: (state) => {
      state.waitingForInput = true;
    },
    stopWaitingForInput: (state) => {
      state.waitingForInput = false;
    },
    openReceipt: (state) => {
      state.receiptOpen = true;
    },
    closeReceipt: (state) => {
      state.receiptOpen = false;
    },
    openError: (state) => {
      state.errorOpen = true;
    },
    closeError: (state) => {
      state.errorOpen = false;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  startWaitingForInput,
  stoptWaitingForInput,
  openReceipt,
  closeReceipt,
  openError,
  closeError,
} = controlSlice.actions;
export default controlSlice.reducer;
