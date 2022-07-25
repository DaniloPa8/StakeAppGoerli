import React, { useContext } from "react";
import classes from "./../styles/Stop.module.css";

import ConnContext from "./Conn-context";

import { useDispatch, useSelector } from "react-redux";

import { checkIsStaker, dispatchError, fireInputError } from "../utils/utils";
import sendTransaction from "../utils/sendTransaction";

const selectLoading = (state) => state.control.loading;

const Stop = (props) => {
  const dispatch = useDispatch();

  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);

  //consuming context

  const { account, tsavings } = useContext(ConnContext);

  // function making a call to blockchain backend for stoping Term savings early

  const stopSavingsHandler = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      if (!(await checkIsStaker(tsavings, account)))
        fireInputError("You are not a registered staker.");

      let action = await tsavings.methods.stopSavings();

      sendTransaction(action, tsavings, account);
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  return (
    <div className={`${classes.stop_open} ${classes.animate_fade}`}>
      <span className={classes.title}>Stop your savings</span>

      <p className={classes.text}>
        WARNING! Stoping term savings early will bring penalties as well as
        reward loss!
      </p>

      <button
        disabled={loading}
        className={classes.submit}
        onClick={stopSavingsHandler}
      >
        Stop savings
      </button>

      <button
        disabled={loading}
        className={classes.close}
        onClick={props.closeStop}
      >
        Close
      </button>
    </div>
  );
};

export default Stop;
