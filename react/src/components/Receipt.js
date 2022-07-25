import React from "react";
import classes from "./../styles/Receipt.module.css";

import web3 from "web3";

import { useDispatch, useSelector } from "react-redux";

const txData = (state) => state.data.txData;

const Receipt = (props) => {
  const dispatch = useDispatch();

  //setting Redux states with the Selector

  const txDataObj = useSelector(txData);

  // Helper for closing and reseting receipt

  const close = () => {
    dispatch({ type: "control/closeReceipt" });
    dispatch({ type: "data/clearTxData" });
  };

  return (
    <div>
      {props.isOpen && (
        <>
          <div className={classes.overlay} onClick={close}></div>
          <div className={classes.modal}>
            <header className={classes.modal__header}>
              <h2>{props.title} Recipt</h2>
              <button onClick={close} className={classes.closeButton}>
                &times;
              </button>
            </header>

            <main className={classes.modal__main}>
              <p className={classes.headText}>
                A succesful transaction has been recorded. The following
                paramaters were emitted:
              </p>

              <p>{txDataObj.sender && `Sender: ${txDataObj.sender}`}</p>

              <p>{txDataObj.plan && `Plan: ${txDataObj.plan}`}</p>

              <p>
                {txDataObj.depositedValue &&
                  `Inital deposit value: ${web3.utils.fromWei(
                    txDataObj.depositedValue,
                    "ether"
                  )} SAT Tokens`}
              </p>

              <p>
                {txDataObj.withdrawnValue &&
                  `Withdrawn value: ${web3.utils.fromWei(
                    txDataObj.withdrawnValue,
                    "ether"
                  )} SAT Tokens`}
              </p>

              <p>
                {txDataObj.depositTime &&
                  `Inital deposit time: ${new Date(
                    txDataObj.depositTime * 1000
                  ).toLocaleString("en-us")}`}
              </p>

              <p>
                {txDataObj.withdrawalTime &&
                  `Withdrawal time: ${new Date(
                    txDataObj.withdrawalTime * 1000
                  ).toLocaleString("en-us")}`}
              </p>

              <p>
                {txDataObj.totalIntrest &&
                  `Total with intrest is: ${web3.utils.fromWei(
                    txDataObj.totalIntrest,
                    "ether"
                  )} SAT Tokens`}
              </p>

              <p>
                {txDataObj.time &&
                  `Executed at: ${new Date(
                    txDataObj.time * 1000
                  ).toLocaleString("en-us")}`}
              </p>

              <p>
                {txDataObj.allowanceAmount &&
                  `Allowed the contract to spend ${web3.utils.fromWei(
                    txDataObj.allowanceAmount
                  )} SAT Tokens.`}
              </p>
              <p>
                {txDataObj.giveawayFunds &&
                  `Giveaway funds:  ${web3.utils.fromWei(
                    txDataObj.giveawayFunds
                  )} SAT Tokens.`}
              </p>
              <p>
                {txDataObj.giveawayValue &&
                  `You have been awared with:  ${web3.utils.fromWei(
                    txDataObj.giveawayValue
                  )} SAT Tokens.`}
              </p>

              <p>
                {txDataObj.value &&
                  `Allowance value: ${web3.utils.fromWei(
                    txDataObj.value
                  )} SAT Tokens.`}
              </p>

              <p>
                {txDataObj.fundedValue &&
                  `You have funded the contract with:
                ${web3.utils.fromWei(txDataObj.fundedValue)} SAT Tokens.`}
              </p>

              <p>
                {txDataObj.giveawayAmount &&
                  `You have withdrawn ${web3.utils.fromWei(
                    txDataObj.giveawayAmount
                  )} tokens from giveaway pool`}
              </p>

              <p>{txDataObj.message}</p>
              {/* LINK TO ETHSCAN  */}
              {txDataObj.txHash && (
                <a
                  className={classes.etherscan_link}
                  target="_blank"
                  href={`https://goerli.etherscan.io/tx/${txDataObj.txHash}`}
                >
                  Click here to see transaction details on Etherscan
                </a>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Receipt;
