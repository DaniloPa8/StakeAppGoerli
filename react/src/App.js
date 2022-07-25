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
import { dispatchError } from "./utils/utils";

function App() {
  // setting states for account and contracts which will be passed to Context
  const [account, setAccount] = useState();
  const [iContract, setiContract] = useState();
  const [tContract, settContract] = useState();
  const [token, setToken] = useState();

  const [mobile, setMobile] = useState();
  // detecting metamask account changes and refresing

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload(false);
      });
    } else if (!window.ethereum) {
      setMobile(true);
    }
  }, [account]);

  // loading the term savings contract

  useEffect(() => {
    const tsavings = new Contract(
      tAbi.abi,
      process.env.REACT_APP_GOERLI_TERM_ADDR,

      { handleRevert: true }
    );

    tsavings.setProvider(
      `wss://goerli.infura.io/ws/v3/ef6c9e371703467fa91e5283048dfb70`
    );

    settContract(tsavings);
  }, []);

  // loading the indefinite savings contract

  useEffect(() => {
    const isavings = new Contract(
      iAbi.abi,
      process.env.REACT_APP_GOERLI_INDEFINITE_ADDR,
      { handleRevert: true }
    );

    isavings.setProvider(
      `wss://goerli.infura.io/ws/v3/ef6c9e371703467fa91e5283048dfb70`
    );
    setiContract(isavings);
  }, []);
  useEffect(() => {
    const tokenContract = new Contract(
      tokenAbi.abi,
      process.env.REACT_APP_GOERLI_TOKEN_ADDR,
      { handleRevert: true }
    );

    tokenContract.setProvider(
      `wss://goerli.infura.io/ws/v3/ef6c9e371703467fa91e5283048dfb70`
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
          <WelcomeScreen
            setAccount={setAccount}
            mobile={mobile}
            setMobile={setMobile}
          />
        </ConnContext.Provider>
      </div>
    </Provider>
  );
}

export default App;
