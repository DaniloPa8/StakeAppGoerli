import React from "react";
import classes from "./../styles/AboutUs.module.css";
import { FaLinkedin, FaGithubSquare } from "react-icons/fa";
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
              <p className={classes.text}>
                StakeAppⒸ is a dApp designed to encourage transparaent and safe
                savings. Everything about the savings process is public and thus
                available on the blockchain for review. No hidden fees.
              </p>
              <p className={classes.text}>
                Backend of this dApp lives on the Goerli Ethereum testnet with
                frontend in ReactJS. In this dApp these two systems achive
                seamless interaction, constantly communicating and exchanging
                data.
              </p>
              <p className={classes.text}>
                This dApp is a demo, and a solo project done by @dev Danilo
                Pavićević. Check out my socials below.
              </p>
              <div className={classes.socials}>
                <a href="https://github.com/DaniloPa8" target="_blank">
                  <FaGithubSquare className={classes.icon1} />
                </a>
                <a
                  href="https://www.linkedin.com/in/danilo-pavicevic-8a3a2215b/"
                  target="_blank"
                >
                  <FaLinkedin className={classes.icon2} />
                </a>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutUs;
