import React from "react";
import classes from "./../styles/Manual.module.css";

// A simple component describing the functionalities of contracts

const Manual = (props) => {
  return (
    <div>
      {props.isOpen && (
        <>
          <div className={classes.overlay} onClick={props.closeModal}></div>
          <div className={`${classes.modal} ${classes.animate_show}`}>
            <header className={classes.modal__header}>
              <h2>Savings manual</h2>
              <button
                onClick={props.closeModal}
                className={classes.closeButton}
              >
                &times;
              </button>
            </header>
            <main className={classes.modal__main}>
              <p>
                To start app intreaction, user should go to the Token modal, and
                get some tokens from the giveaway (which is available once every
                24h per address), small amount of Goerli tesnet ETH is also
                required which can be obtained at one of many faucets available.
                Also it is REQUIRED to give allowance to the contract, the
                amount of which depends on how much you want to stake.
              </p>
              <p>
                Upon selecting the 'start savings' option User can decide upon
                term or non-term savings.
              </p>
              <p>
                Term savings need to be locked for a predefined period of time
                (1 , 2 or 3 minutes) and cant be withdrawn before that period
                expires.
              </p>
              <p>
                Non-term savings can be stopped at any time but reward is also
                smaller.
              </p>
              <p>
                User needs to choose their savings method, value and period of
                lockup if needed. Savings can be started with 'start savings'
                button. User can then check on their current savings by opening
                the 'get savings' section, where all details can be retrived.
              </p>
              <p>
                When in term savings User can withdraw their funds+reward after
                the choosen period has expired by opening the 'withdraw savings'
                section.
              </p>
              <p>
                Non-term savings can also be withdrawn this way at any point in
                time.
              </p>
              <p>
                Term savings Users can also forcefully stop their term savings
                in the 'stop savings' section, but this carries the penalty of
                not reciving the reward and a 5% intrest penalty of the
                deposited funds being kept by the StakeApp.
              </p>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Manual;
