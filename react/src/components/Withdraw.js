import React, { useContext } from "react";
import classes from "./../styles/Withdraw.module.css";
import ConnContext from "./Conn-context";
import TermSelector from "./TermSelector";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError, dispatchResult } from "../utils";

const selectLoading = (state) => state.control.loading;

const Withdraw = (props) => {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);

  const { account, tsavings, isavings } = useContext(ConnContext);

  // function making a call to blockchain backend for withdrawing funds

  const withdraw = async () => {
    try {
      dispatch({ type: "control/startLoading" });

      let target = props.term ? tsavings : isavings;

      let res = await target.methods
        .withdrawDeposit()
        .send({ from: account, gas: 30000000 });

      res = res.events.LogWthDeposit.returnValues;

      dispatchResult(JSON.stringify(res));
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
