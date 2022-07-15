import React from "react";
import classes from "./../styles/Error.module.css";
import { useDispatch, useSelector } from "react-redux";

const errorSelector = (state) => state.data.errorData.message;
const errCode = (state) => state.data.errorData.code;

const Error = (props) => {
  const dispatch = useDispatch();

  // getting state from redux

  const errorMessage = useSelector(errorSelector);
  const errorCode = useSelector(errCode);

  // helper function for closing the error modal
  // and reseting the data to null

  const close = () => {
    dispatch({ type: "data/clearErrorMessage" });
    dispatch({ type: "control/closeError" });
  };

  return (
    <div>
      {props.isOpen && (
        <>
          <div className={classes.overlay} onClick={close}></div>
          <div className={classes.modal}>
            <header className={classes.modal__header}>
              <h2>Error message</h2>
              <button onClick={close} className={classes.closeButton}>
                &times;
              </button>
            </header>
            <main className={classes.modal__main}>
              <p className={classes.headText}>
                Transaction has encountered an error. Error has the message of:
              </p>
              <p className={classes.error_text}>{errorMessage}</p>
              {process.env.REACT_APP_ENVIROMENT === "development" && (
                <p>{`Error code provided: ${errorCode}`}</p>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Error;
