import React, { useRef, useContext } from "react";
import classes from "./../styles/Savings.module.css";
import ConnContext from "./Conn-context";
import web3 from "web3";
import errors from "web3-core-helpers";
import { dispatchError, dispatchResult, checkInputs } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import TermSelector from "./TermSelector";

const inputError = errors.errors.RevertInstructionError; // web3-core-helpers errors to get uniform errors accross the whole app
const selectLoading = (state) => state.control.loading;

const Savings = (props) => {
  // loading context

  const loading = useSelector(selectLoading);

  const { account, tsavings, isavings } = useContext(ConnContext);

  // setting state
  const dispatch = useDispatch();

  // setting input ref's
  const planRef = useRef();
  const valueRef = useRef();

  // function making a call to blockchain backend for starting Term savings

  const startTerm = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let amount = valueRef.current.value;
      let plan = planRef.current.value;

      if (!checkInputs(amount, plan))
        throw inputError("Invalid inputs.", "Error(String)");

      amount = web3.utils.toWei(amount, "ether");

      let res = await tsavings.methods
        .newDeposit(plan, amount)
        .send({ from: account, gas: 300000 });
      res = res.events.LogNewDeposit.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }

    planRef.current.value = null;
    valueRef.current.value = null;
  };

  // function making a call to blockchain backend for starting Indefinite savings

  const startIndefinite = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let amount = valueRef.current.value;

      if (!checkInputs(amount))
        throw inputError("Invalid inputs.", "Error(String)");

      amount = web3.utils.toWei(amount, "ether");

      let res = await isavings.methods
        .newDeposit(amount)
        .send({ from: account, gas: 300000 });
      res = res.events.LogNewDeposit.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }

    valueRef.current.value = null;
  };

  return (
    <div className={`${classes.open_savings} ${classes.animate_fade}`}>
      <TermSelector setTerm={props.setTerm} term={props.term} />

      {props.term && (
        <input
          placeholder="Choose your plan (1, 2 or 3)"
          min="1"
          max="3"
          type="number"
          step="1"
          ref={planRef}
          className={classes.input}
        ></input>
      )}

      <input
        placeholder="Input the value you want to deposit (1 - 1000 SAT)"
        min="0.01"
        max="1000"
        type="number"
        step="0.01"
        className={classes.input}
        ref={valueRef}
      ></input>

      <button
        disabled={loading}
        className={classes.close}
        onClick={props.closeSavings}
      >
        Close
      </button>
      <button
        disabled={loading}
        className={classes.submit}
        onClick={() => (props.term ? startTerm() : startIndefinite())}
      >
        Start savings
      </button>
    </div>
  );
};

export default Savings;
