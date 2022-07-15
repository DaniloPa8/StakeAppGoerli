import store from "./store";

// helper function for dispatching error and passing
// data to the redux reducers

export const dispatchError = (reason) => {
  store.dispatch({ type: "control/stopLoading" });

  store.dispatch({ type: "data/setErrorMessage", payload: reason });

  store.dispatch({ type: "control/openError" });
};

// helper function for dispatching tx results and passing
// data to the redux reducers

export const dispatchResult = (result) => {
  store.dispatch({ type: "data/setTxData", payload: result });

  store.dispatch({ type: "control/stopLoading" });

  store.dispatch({ type: "control/openReceipt" });
};

// function for checking input validity

export const checkInputs = (value, plan = null) => {
  if (value <= 0 || value > 1000) return false;
  else if (plan && (plan <= 0 || plan > 3)) return false;
  else return true;
};

export const signTransaction = async (action, target, sender) => {
  let reciver;
  if (target === "tsavings") reciver = process.env.REACT_APP_TERM_SAVINGS_RINK;
  if (target === "isavings")
    reciver = process.env.REACT_APP_INDEFINITE_SAVINGS_RINK;
  if (!target) {
    throw new Error("No RECIVER set");
  }
  const result = {};
  let data;

  const count = await web3.eth.getTransactionCount(sender);

  const nonce = web3.utils.toHex(count);
  const gasLimit = web3.utils.toHex(300000);
  const gasPrice = web3.utils.toHex(
    web3.eth.gasPrice || web3.utils.toHex(2 * 1e9)
  );
  const value = web3.utils.toHex(web3.utils.toWei("0", "wei"));

  data = action.encodeABI();

  const txData = {
    nonce,
    gasLimit,
    gasPrice,
    value,
    data,
    from: sender,
    to: reciver,
  };
  //Propmting metamask to sign the transaction
  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [txData],
  });

  result["receipt"] = txHash;
  console.log(result["receipt"]);
  reciver = null;
};

export default signTransaction;
