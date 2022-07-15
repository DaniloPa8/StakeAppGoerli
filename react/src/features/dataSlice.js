import { createSlice } from "@reduxjs/toolkit";

// Setting inital data thats also used to clear generated data
// once a modal closes

const initalTx = {
  sender: null,
  value: null,
  withdrawnValue: null,
  plan: null,
  depositTime: null,
  withdrawalTime: null,
  totalIntrest: null,
  time: null,
  allowanceAmount: null,
  giveawayFunds: null,
  giveawayValue: null,
};

const initalError = {
  message: null,
  code: null,
};

// creating a data slice for handling the processing of
// succesful tranasaction data as well as error data

const dataSlice = createSlice({
  name: "data",
  initialState: {
    txData: initalTx,
    errorData: initalError,
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
      let data = action.payload;

      if (data.includes("|")) {
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
      } else {
        state.errorData.message = "Uknown error has occured.";
        state.errorData.code = 9999;
      }
    },
    clearErrorMessage: (state) => {
      state.errorData = initalError;
    },
  },
});

export const { setTxData, clearTxData, setErrorMessage, clearErrorMessage } =
  dataSlice.actions;
export default dataSlice.reducer;
