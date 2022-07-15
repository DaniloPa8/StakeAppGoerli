import React, { useState, useContext, useRef, useEffect } from "react";
import classes from "./../styles/OwnerPanel.module.css";
import ConnContext from "./Conn-context";
import web3 from "web3";
import TermSelector from "./TermSelector";
import db from "./../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import errors from "web3-core-helpers";
import { dispatchError, dispatchResult, checkInputs } from "../utils";
import { useDispatch, useSelector } from "react-redux";

const selectLoading = (state) => state.control.loading;
const inputError = errors.errors.RevertInstructionError; // loading up error from web3-core-helpers to have uniform error format across the whole app

const userRef = collection(db, "Giveaway");
const Token = (props) => {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);

  const { account, token, isavings } = useContext(ConnContext);

  const [disableButton, setDisableButton] = useState(false);
  const [balance, setBalance] = useState(0);
  let users = [];
  let currentUser = {};

  const depositRef = useRef();

  useEffect(
    () => async () => {
      await filterAndDelete();
    },
    []
  );

  const filterAndDelete = async () => {
    // Setting the data after filtering to get the current state
    const data = await getDocs(userRef);
    users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    let usersForDeletion = [];

    // Filtering the retrived documents to remove expired ones
    users.forEach((el, i) => {
      if (el.withdrawalTime < Date.now() / 1000 - 60) {
        usersForDeletion.push(el);
        users.splice(i, 1);
      }
    });

    //Removing expired ones
    for (const el of usersForDeletion) {
      const userDoc = doc(db, "Giveaway", el.id);
      await deleteDoc(userDoc);
    }

    // Setting the current user from the remaining users, if present
    currentUser = users.find(
      (el) => el.address.toLowerCase() === account.toString()
    );
    if (currentUser) {
      setDisableButton(true);
    }
  };

  // function for calling the blockchain backend and funding the contract

  const giveAllowance = async () => {
    let address = props.term
      ? process.env.REACT_APP_TERM_ADDR
      : process.env.REACT_APP_INDEFINITE_ADDR;
    try {
      dispatch({ type: "control/startLoading" });

      let amount = depositRef.current.value;

      if (!checkInputs(amount))
        throw inputError("Invalid inputs.", "Error(String)");

      amount = web3.utils.toWei(amount, "ether");

      await token.methods.approve(address, amount).send({ from: account });

      let res = {
        sender: account,
        allowanceAmount: amount,
      };

      dispatchResult(JSON.stringify(res));
    } catch (err) {
      dispatchError(err.reason);
    }
    depositRef.current.value = "";
  };

  const giveawayHandler = async () => {
    dispatch({ type: "control/startLoading" });
    await filterAndDelete();

    try {
      if (currentUser) {
        throw inputError("7005 | Only one givaway is available every 24h.");
      } else {
        await addDoc(userRef, {
          address: account,
          withdrawalTime: Math.floor(Date.now() / 1000),
          attempts: 0,
        });
        let res = await isavings.methods.givaway().send({ from: account });
        res = res.events.LogGiveaway.returnValues;

        dispatchResult(JSON.stringify(res));
      }
    } catch (err) {
      dispatchError(err.reason);
    }
  };

  const balanceHanlder = async () => {
    let res = await token.methods.balanceOf(account).call({ from: account });
    setBalance(web3.utils.fromWei(res, "ether"));
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
                className={classes.input}
                placeholder="Amount of tokens to allow to the contract: 1 - 1000"
                step="0.01"
                min="0"
                max="1000"
                type="number"
                ref={depositRef}
              ></input>

              <button
                disabled={loading}
                className={classes.button}
                onClick={giveAllowance}
              >
                Give allowance
              </button>

              <button onClick={balanceHanlder} className={classes.button}>{`${
                balance === 0 ? "Check my balance" : `${balance} SAT Tokens`
              }`}</button>

              {/* GIVEAWAY */}

              <p className={classes.text}>
                Everyone is able to get 100 tokens a day from the giveaway!
              </p>
              <button
                className={classes.button}
                onClick={giveawayHandler}
                disabled={disableButton}
              >
                {" "}
                CLAIM{" "}
              </button>
              {disableButton && (
                <p className={classes.text}>Try again after 24h expires.</p>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Token;
