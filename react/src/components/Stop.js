import React, { useContext } from "react";
import classes from "./../styles/Stop.module.css";
import ConnContext from "./Conn-context";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError, dispatchResult } from "../utils";

const selectLoading = (state) => state.control.loading;

const Stop = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  const { account, tsavings } = useContext(ConnContext);

  // function making a call to blockchain backend for stoping Term savings early

  const stopSavingsHandler = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let res = await tsavings.methods
        .stopSavings()
        .send({ from: account, gas: 3000000 });
      res = res.events.LogRemDeposit.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  return (
    <div className={`${classes.stop_open} ${classes.animate_fade}`}>
      <span className={classes.title}>Stop your savings</span>

      <p className={classes.text}>
        WARNING! Stoping term savings early can bring penalties and fees as well
        as reward loss!
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
