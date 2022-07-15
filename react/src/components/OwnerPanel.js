import React, { useContext, useRef } from "react";
import classes from "./../styles/OwnerPanel.module.css";
import ConnContext from "./Conn-context";
import web3 from "web3";
import TermSelector from "./TermSelector";
import errors from "web3-core-helpers";
import { dispatchError, dispatchResult, checkInputs } from "../utils";
import { useDispatch, useSelector } from "react-redux";

const selectLoading = (state) => state.control.loading;
const inputError = errors.errors.RevertInstructionError; // loading up error from web3-core-helpers to have uniform error format across the whole app

const OwnerPanel = (props) => {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);

  const { account, tsavings, isavings, token } = useContext(ConnContext);

  const depositRef = useRef();
  const withdrawRef = useRef(); // defininf the Ref's for inputs
  const withAddrRef = useRef();

  // function for calling the blockchain backend and funding the contract

  const fundContract = async () => {
    let target = props.term ? tsavings : isavings;

    try {
      dispatch({ type: "control/startLoading" });

      let amount = depositRef.current.value;

      amount = web3.utils.toWei(amount, "ether");

      let res = await target.methods
        .fundContract(amount)
        .send({ from: account });

      res = res.events.LogOwnerDeposit.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
    depositRef.current.value = "";
  };
  // function for calling the blockchain backend and withdrawing funds from contract

  const withdrawFunds = async () => {
    let target = props.term ? tsavings : isavings;

    try {
      dispatch({ type: "control/startLoading" });

      let amount = withdrawRef.current.value;

      if (!checkInputs(amount))
        throw inputError("Invalid inputs.", "Error(String)");

      amount = web3.utils.toWei(amount, "ether");

      let addr = withAddrRef.current.value;

      if (addr.length != 42)
        throw inputError("Invalid address inputs.", "Error(String)");

      let res = await target.methods
        .withdrawContractFunds(addr.toString(), amount)
        .send({ from: account });

      res = res.events.LogOwnerWithdraw.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
    withdrawRef.current.value = "";
    withAddrRef.current.value = "";
  };

  const giveAllowance = async () => {
    try {
      dispatch({ type: "control/startLoading" });
      let allowance = web3.utils.toWei("100000000", "ether");

      await token.methods
        .approve(process.env.REACT_APP_INDEFINITE_ADDR, allowance)
        .send({ from: account });
      await token.methods
        .approve(process.env.REACT_APP_TERM_ADDR, allowance)
        .send({ from: account });
      let res = {
        sender: account,
        allowanceAmount: allowance,
      };
      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  const fundGiveaway = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let res = await isavings.methods
        .fundGiveaway()
        .send({ from: account, gas: 300000 });

      res = res.events.LogFundGiveaway.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
  };
  const withdrawGiveaway = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let res = await isavings.methods
        .withdrawGiveaway()
        .send({ from: account });

      res = res.events.LogWithdrawGiveaway.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  return (
    <div>
      {props.isOpen && (
        <>
          <div className={classes.overlay} onClick={props.closeModal}></div>

          <div className={`${classes.modal} ${classes.animate_show}`}>
            <header className={classes.modal__header}>
              <h2>Owner panel</h2>

              <button
                onClick={props.closeModal}
                className={classes.closeButton}
              >
                &times;
              </button>
            </header>

            <main className={classes.modal__main}>
              <TermSelector setTerm={props.setTerm} term={props.term} />

              <input
                className={classes.input}
                placeholder="Desired amount to withdraw in SAT:"
                step="0.01"
                min="0"
                type="number"
                ref={withdrawRef}
              ></input>

              <input
                className={classes.input}
                placeholder="Address to withdraw to:"
                type="string"
                ref={withAddrRef}
              ></input>

              <button
                disabled={loading}
                className={classes.button}
                onClick={withdrawFunds}
              >
                Withdraw funds
              </button>

              <input
                className={classes.input}
                placeholder="Amount of funds to deposit in SAT:"
                step="0.01"
                min="0"
                type="number"
                ref={depositRef}
              ></input>

              <button
                disabled={loading}
                className={classes.button}
                onClick={fundContract}
              >
                Fund the contract
              </button>
              <button className={classes.button} onClick={giveAllowance}>
                Give Max Allowance
              </button>
              <button className={classes.button} onClick={fundGiveaway}>
                Fund Giveaway
              </button>
              <button className={classes.button} onClick={withdrawGiveaway}>
                Withdraw Giveaway funds
              </button>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerPanel;
