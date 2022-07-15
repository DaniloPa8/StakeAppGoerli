import React, { useContext } from "react";
import classes from "./../styles/GetSavings.module.css";
import ConnContext from "./Conn-context";
import TermSelector from "./TermSelector";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError, dispatchResult } from "../utils";

const selectLoading = (state) => state.control.loading;

const GetSavings = (props) => {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading); // getting the state from redux

  const { account, tsavings, isavings } = useContext(ConnContext); // consuming the context

  // Get savings call to blockchain

  const getSavingsHandler = async () => {
    try {
      dispatch({ type: "control/startLoading" });
      let target = props.term ? tsavings : isavings;

      let res = await target.methods
        .getDeposit()
        .send({ from: account, gas: 300000 });
      res = res.events.LogGetDeposit.returnValues;

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  return (
    <div className={`${classes.get_savings_open} ${classes.animate_fade}`}>
      <TermSelector setTerm={props.setTerm} term={props.term} />
      <p className={classes.mid_txt}>
        Choose the type of your savings and get all the details
      </p>
      <button
        disabled={loading}
        className={classes.submit}
        onClick={getSavingsHandler}
      >
        Get details
      </button>
      <button
        disabled={loading}
        className={classes.close}
        onClick={props.closeGetSavings}
      >
        Close
      </button>
    </div>
  );
};

export default GetSavings;
