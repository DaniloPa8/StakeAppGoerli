import eth from "web3-eth";
import store from "../store";
import web3 from "web3";
import { dispatchError, dispatchResult } from "./utils";

const sendTransaction = async (action, target, account) => {
  const Eth = new eth(
    "https://goerli.infura.io/v3/ef6c9e371703467fa91e5283048dfb70"
  );

  // Get Events if transaction is succesful

  const getEvents = async (blockNumber, txHash, iteration) => {
    function timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await timeout(5000);
    await target.getPastEvents(
      "allEvents",
      { fromBlock: blockNumber },
      (error, events) => {
        if (error) console.log(error);
        else if (events.length != 0) {
          let result = { ...events[events.length - 1].returnValues, txHash };
          dispatchResult(JSON.stringify(result));
        } else if (iteration > 5) {
          let data = {
            message:
              "Transaction completed successfully without emitted events. ",
            txHash,
          };

          dispatchResult(JSON.stringify(data));
        } else {
          getEvents(blockNumber, txHash, iteration + 1);
        }
      }
    );
  };

  // Querying for block number until it is available
  const getBlockNumber = (txHash) => {
    store.dispatch({ type: "control/stopWaitingForInput" });
    Eth.getTransactionReceipt(txHash, async (error, recipt) => {
      if (error) {
        dispatchError();
      } else if (recipt === null) {
        setTimeout(() => getBlockNumber(txHash), 500);
      } else if (recipt.status === true) {
        await getEvents(recipt.blockNumber, txHash, 0);
      } else if (recipt.status === false) {
        dispatchError({
          message: "Transacion has reverted. Check Etherscan for more info.",
          txHash,
        });
      }
    });
  };

  // Sending the TX using METAMASK provider
  const sendTransactionMM = async (txData) => {
    const Eth = new eth(ethereum);
    try {
      await Eth.sendTransaction(txData, (error, txHash) => {
        if (!error) getBlockNumber(txHash);
      });
    } catch (err) {
      if (!err.message.includes("EVM")) dispatchError({ message: err.message });
    }
  };

  //Build TX
  try {
    store.dispatch({ type: "control/startWaitingForInput" });
    const gasLimit = web3.utils.toHex(300000);
    const gasPrice = web3.utils.toHex(
      Eth.gasPrice || web3.utils.toHex(2 * 1e9)
    );
    const value = web3.utils.toHex(web3.utils.toWei("0", "wei"));

    const count = await Eth.getTransactionCount(account);

    const nonce = web3.utils.toHex(count);

    let data = action.encodeABI();

    const txData = {
      nonce,
      gasLimit,
      value,
      data,
      gasPrice,
      from: account,
      to: target._address,
    };
    //Propmting metamask to sign the transaction

    sendTransactionMM(txData);
  } catch (err) {
    dispatchError({ message: err.message, code: err.code });
  }
};

export default sendTransaction;
