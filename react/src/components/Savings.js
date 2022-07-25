import React, { useState, useContext } from "react";
import classes from "./../styles/Savings.module.css";

import TermSelector from "./TermSelector";

import ConnContext from "./Conn-context";

import web3 from "web3";

import {
  dispatchError,
  checkInputs,
  checkBalance,
  checkAllowance,
  fireInputError,
  checkIsStaker,
} from "../utils/utils";
import sendTransaction from "../utils/sendTransaction";

import { useDispatch, useSelector } from "react-redux";

const selectLoading = (state) => state.control.loading;

const Savings = (props) => {
  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);

  const { account, tsavings, isavings, token } = useContext(ConnContext); // consuming context

  const dispatch = useDispatch();

  // setting input states
  const [planState, setPlanState] = useState();
  const [valueState, setValueState] = useState();

  // helper for reseting state

  const resetState = () => {
    setPlanState("");
    setValueState("");
  };

  // function making a call to blockchain backend for starting savings

  const startSavings = async () => {
    let target = props.term ? tsavings : isavings;
    try {
      dispatch({ type: "control/startLoading" });

      if (await checkIsStaker(target, account))
        fireInputError("You are already a staker!");
      if (!checkInputs(valueState, planState))
        fireInputError("Invalid inputs.");
      if (!(await checkBalance(valueState, account, token)))
        fireInputError("Insufficient balance of user account.");
      if (!(await checkAllowance(valueState, account, token, target._address)))
        fireInputError(
          "Insufficient allowance of user account to the contract."
        );

      let amount = web3.utils.toWei(valueState, "ether");
      let action;
      if (props.term) action = tsavings.methods.newDeposit(planState, amount);
      if (!props.term) action = isavings.methods.newDeposit(amount);
      sendTransaction(action, target, account);
    } catch (err) {
      dispatchError(err.reason);
    }

    resetState();
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
          value={planState}
          onChange={(e) => setPlanState(e.target.value)}
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
        value={valueState}
        onChange={(e) => setValueState(e.target.value)}
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
        onClick={startSavings}
      >
        Start savings
      </button>
    </div>
  );
};

export default Savings;
