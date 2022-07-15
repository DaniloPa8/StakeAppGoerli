import React from "react";
import classes from "./../styles/Manual.module.css";

// A simple modal displaying text only

const AboutUs = (props) => {
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
                StakeAppⒸ is a dApp designed to encourage transparaent and safe
                savings. Everything about the savings process is public and thus
                available on the blockchain for review. No hidden fees.
              </p>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutUs;
