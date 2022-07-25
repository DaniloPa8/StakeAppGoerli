import React, { useContext } from "react";
import classes from "./../styles/GetSavings.module.css";

import ConnContext from "./Conn-context";

import TermSelector from "./TermSelector";

import { useDispatch, useSelector } from "react-redux";

import { checkIsStaker, dispatchError, fireInputError } from "../utils/utils";
import sendTransaction from "../utils/sendTransaction";

const selectLoading = (state) => state.control.loading;

const GetSavings = (props) => {
  const dispatch = useDispatch();

  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);

  const { account, tsavings, isavings } = useContext(ConnContext); // consuming the context

  // Get savings call to blockchain

  const getSavingsHandler = async () => {
    try {
      dispatch({ type: "control/startLoading" });
      let target = props.term ? tsavings : isavings;

      if (!(await checkIsStaker(target, account)))
        fireInputError("You are not a staker.");

      let action = await target.methods.getDeposit();

      sendTransaction(action, target, account);
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
