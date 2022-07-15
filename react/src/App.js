import "./App.css";
import Contract from "web3-eth-contract";
import tAbi from "./contracts/TermSavings.json";
import iAbi from "./contracts/IndefiniteSavings.json";
import tokenAbi from "./contracts/SavingsToken.json";
import WelcomeScreen from "./components/WelcomeScreen";
import ConnContext from "./components/Conn-context";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  // setting states for account and contracts which will be passed to Context
  const [account, setAccount] = useState();
  const [iContract, setiContract] = useState();
  const [tContract, settContract] = useState();
  const [token, setToken] = useState();
  // detecting metamask account changes and refresing

  window.ethereum.on("accountsChanged", () => {
    window.location.reload(false);
  });

  // loading the term savings contract

  useEffect(() => {
    const tsavings = new Contract(
      tAbi.abi,
      process.env.REACT_APP_TERM_ADDR,

      { handleRevert: true }
    );

    tsavings.setProvider(`ws://localhost:${process.env.REACT_APP_PORT_NUMBER}`);
    settContract(tsavings);
  }, []);

  // loading the indefinite savings contract

  useEffect(() => {
    const isavings = new Contract(
      iAbi.abi,
      process.env.REACT_APP_INDEFINITE_ADDR,
      { handleRevert: true }
    );

    isavings.setProvider(`ws://localhost:${process.env.REACT_APP_PORT_NUMBER}`);
    setiContract(isavings);
  }, []);
  useEffect(() => {
    const tokenContract = new Contract(
      tokenAbi.abi,
      process.env.REACT_APP_TOKEN_ADDR,
      { handleRevert: true }
    );

    tokenContract.setProvider(
      `ws://localhost:${process.env.REACT_APP_PORT_NUMBER}`
    );
    setToken(tokenContract);
  }, []);
  return (
    <Provider store={store}>
      <div className="App">
        <ConnContext.Provider
          value={{
            account,
            tsavings: tContract,
            isavings: iContract,
            token: token,
          }}
        >
          <WelcomeScreen setAccount={setAccount} />
        </ConnContext.Provider>
      </div>
    </Provider>
  );
}

export default App;
