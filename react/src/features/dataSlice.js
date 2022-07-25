import { createSlice } from "@reduxjs/toolkit";

// Setting inital data thats also used to clear generated data
// once a modal closes

const initalTx = {
  sender: null,
  depositedValue: null,
  withdrawnValue: null,
  fundedValue: null,
  plan: null,
  depositTime: null,
  withdrawalTime: null,
  totalIntrest: null,
  time: null,
  allowanceAmount: null,
  giveawayFunds: null,
  giveawayValue: null,
  giveawayAmount: null,
  txHash: null,
  message: null,
  value: null,
};

const initalError = {
  message: null,
  code: null,
  txHash: null,
};

const initalBlockData = { blockNumber: null, txHash: null };
// creating a data slice for handling the processing of
// succesful tranasaction data as well as error data

const dataSlice = createSlice({
  name: "data",
  initialState: {
    txData: initalTx,
    errorData: initalError,
    blockData: initalBlockData,
  },
  reducers: {
    setTxData: (state, action) => {
      state.txData = JSON.parse(action.payload);
    },
    clearTxData: (state) => {
      state.txData = initalTx;
    },
    // Handling error messages with custom error codes that have been
    // implemented in the contract itself using require and handleRevert
    setErrorMessage: (state, action) => {
      let data = action.payload.message;
      if (data && data.includes("|")) {
        let splitPoint = data.indexOf("|");

        let errorCode = data.slice(splitPoint - 6, splitPoint);
        state.errorData.code = parseInt(errorCode);
        let errorMessage = data.slice(splitPoint + 1);
        state.errorData.message = errorMessage;
      } else if (data.includes("inputs")) {
        state.errorData.message = "Invalid inputs.";
        state.errorData.code = 8000;
      } else if (data.includes("ERC")) {
        let message = data.slice(data.indexOf("ERC20:") + 7, -2);
        message = message.charAt(0).toUpperCase() + message.slice(1);
        state.errorData.message = `Token error: ${message}`;
        state.errorData.code = 7555;
      } else if (!action.payload.message) {
        state.errorData.message = "Uknown error has occured.";
        state.errorData.code = 9999;
      }
      if (action.payload.txHash) {
        state.errorData.txHash = action.payload.txHash;
        state.errorData.message = action.payload.message;
      } else if (!action.payload.txData && action.payload.message)
        state.errorData.message = action.payload.message;
    },
    clearErrorMessage: (state) => {
      state.errorData = initalError;
    },
    setBlockData: (state, action) => {
      let number = action.payload.blockNum;
      let txHash = action.payload.transactionHash;
      state.blockData.blockNumber = number;
      state.blockData.txHash = txHash;
    },
    clearBlockData: (state) => {
      state.blockData = initalBlockData;
    },
  },
});

export const {
  setTxData,
  clearTxData,
  setErrorMessage,
  clearErrorMessage,
  setBlockData,
  clearBlockData,
} = dataSlice.actions;
export default dataSlice.reducer;
