import react, { useState } from "react";
import classes from "./../styles/WelcomeScreen.module.css";
import Dashboard from "./Dashboard";
import logo from "./../logo.png";
import { dispatchError } from "../utils";

const WelcomeScreen = (props) => {
  const [connected, setIsConnected] = useState(false); // state for managing if the user has connected his waller
  // connecting Metamask

  const connMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        props.setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        dispatchError("9000 | User has not connected the account");
      }
    }
  };

  if (!connected) {
    return (
      <div className={classes.welcome_frame}>
        <div className={classes.welcome_content}>
          <div className={classes.title}>
            <h1 className={classes.title1}>Welcome to -</h1>
            <h1 className={classes.title2}>StakeAppⒸ</h1>
          </div>

          <img src={logo} className={classes.image} />

          <h3 className={classes.text}>
            Please connect your Metamask wallet to continue
          </h3>

          <div className={classes.button} onClick={connMetamask}>
            CONNECT
          </div>
        </div>
      </div>
    );
  } else if (connected) {
    return <Dashboard />;
  }
};

export default WelcomeScreen;
