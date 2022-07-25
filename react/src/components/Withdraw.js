import React, { useContext } from "react";
import classes from "./../styles/Withdraw.module.css";

import ConnContext from "./Conn-context";

import TermSelector from "./TermSelector";

import { checkIsStaker, dispatchError, fireInputError } from "../utils/utils";
import sendTransaction from "../utils/sendTransaction";

import { useDispatch, useSelector } from "react-redux";

const selectLoading = (state) => state.control.loading;

const Withdraw = (props) => {
  const dispatch = useDispatch();

  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);

  const { account, tsavings, isavings } = useContext(ConnContext); // consuming the context

  // function making a call to blockchain backend for withdrawing funds

  const withdraw = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let target = props.term ? tsavings : isavings;

      if (!(await checkIsStaker(target, account)))
        fireInputError("You are not a registered staker.");

      let action = await target.methods.withdrawDeposit();

      sendTransaction(action, target, account);
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  return (
    <div className={`${classes.withdraw_open} ${classes.animate_fade}`}>
      <TermSelector setTerm={props.setTerm} term={props.term} />
      <p className={classes.mid_txt}>
        Choose your savings option and withdraw funds along with a reward
      </p>
      <button disabled={loading} className={classes.submit} onClick={withdraw}>
        Withdraw savings
      </button>
      <button
        disabled={loading}
        className={classes.close}
        onClick={props.closeWithdraw}
      >
        Close
      </button>
    </div>
  );
};

export default Withdraw;
