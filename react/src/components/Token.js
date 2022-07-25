import React, { useState, useContext, useEffect } from "react";
import classes from "./../styles/Token.module.css";

import ConnContext from "./Conn-context";
import TermSelector from "./TermSelector";

import web3 from "web3";
import {
  dispatchError,
  checkInputs,
  filterAndDelete,
  checkGiveaway,
  fireInputError,
  normalizeNumber,
} from "../utils/utils";
import sendTransaction from "../utils/sendTransaction";

import db from "./../firebase";
import { addDoc, collection } from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";

// Setting database, state slice and a custom inputError

const selectLoading = (state) => state.control.loading;
const userRef = collection(db, "Giveaway");

const Token = (props) => {
  const dispatch = useDispatch();

  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);

  const { account, token, isavings, tsavings } = useContext(ConnContext); // consuming the context

  // setting state

  const [disableButton, setDisableButton] = useState(false);
  const [balance, setBalance] = useState(null);
  const [allowanceCheck, setAllowanceCheck] = useState(null);

  const [allowance, setAllowance] = useState();

  // useEffect for filtering the databse when component mounts

  useEffect(
    () => async () => {
      if (await filterAndDelete(account)) setDisableButton(true);
    },
    []
  );
  useEffect(() => {
    setAllowanceCheck("");
    setBalance("");
  }, [props.term]);

  // function for calling the blockchain backend and giving allowance to the contract

  const giveAllowance = async () => {
    let address = props.term
      ? process.env.REACT_APP_GOERLI_TERM_ADDR
      : process.env.REACT_APP_GOERLI_INDEFINITE_ADDR;
    try {
      dispatch({ type: "control/startLoading" });

      if (!checkInputs(allowance)) fireInputError("Invalid inputs.");

      let amount = web3.utils.toWei(allowance, "ether");

      let action = token.methods.approve(address, amount);

      sendTransaction(action, token, account);
    } catch (err) {
      dispatchError(err.reason);
    }
    setAllowance("");
    setAllowanceCheck("");
  };

  // function for getting giveaway funds

  const giveawayHandler = async () => {
    dispatch({ type: "control/startLoading" });

    try {
      if (await filterAndDelete(account)) {
        setDisableButton(true);
        fireInputError("Only one givaway is available every 24h per user.");
      }

      if (!(await checkGiveaway(isavings)))
        fireInputError(
          "No giveaway funds currently available, try again later."
        );

      await addDoc(userRef, {
        address: account,
        withdrawalTime: Math.floor(Date.now() / 1000),
        attempts: 0,
      });

      let action = isavings.methods.giveaway();

      sendTransaction(action, isavings, account);
    } catch (err) {
      dispatchError(err.reason);
    }
    setBalance("");
  };

  // quick balance call to contract

  const balanceHanlder = async () => {
    let res = await token.methods.balanceOf(account).call({ from: account });
    res = normalizeNumber(res);
    setBalance(res);
  };
  const allowanceHandler = async () => {
    let target = props.term ? tsavings : isavings;
    let res = await token.methods.allowance(account, target._address).call();
    res = normalizeNumber(res);
    setAllowanceCheck(res);
  };

  return (
    <div>
      {props.isOpen && (
        <>
          <div className={classes.overlay} onClick={props.closeModal}></div>

          <div className={`${classes.modal} ${classes.animate_show}`}>
            <header className={classes.modal__header}>
              <h2>Token panel</h2>

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
                className={`${classes.inputAllowance} ${classes.input}`}
                placeholder="Amount of tokens to allow to the contract: 1 - 1000"
                step="0.01"
                min="0"
                max="1000"
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(e.target.value)}
              ></input>

              <button
                disabled={loading}
                className={`${classes.button} ${classes.buttonAllowance}`}
                onClick={giveAllowance}
              >
                Give allowance
              </button>

              <button
                onClick={balanceHanlder}
                className={`${classes.button} ${classes.buttonCheckAllowance}`}
              >{`${
                balance === "" ? "Check my balance" : `${balance} SAT Tokens`
              }`}</button>
              <button
                onClick={allowanceHandler}
                className={`${classes.button} ${classes.buttonCheckBalance}`}
              >{`${
                allowanceCheck === ""
                  ? "Check my allowance"
                  : `${allowanceCheck} SAT Tokens`
              }`}</button>

              {/* GIVEAWAY */}

              <p className={`${classes.text} ${classes.textGiveaway}`}>
                Everyone is able to get 100 tokens a day from the giveaway!
              </p>
              <button
                className={`${classes.button} ${classes.buttonGiveaway}`}
                onClick={giveawayHandler}
                disabled={disableButton}
              >
                CLAIM GIVEAWAY
              </button>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Token;
