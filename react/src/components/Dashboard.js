import React, { useContext, useState, useEffect } from "react";

import classes from "./../styles/Dashboard.module.css";

// Component imports

import Error from "./Error";
import Savings from "./Savings";
import Withdraw from "./Withdraw";
import Stop from "./Stop";
import GetSavings from "./GetSavings";
import OwnerPanel from "./OwnerPanel";
import Manual from "./Manual";
import AboutUs from "./AboutUs";
import ConnContext from "./Conn-context";
import LoadingOverlay from "react-loading-overlay";
import Circle from "react-spinners/CircleLoader";
import Receipt from "./Receipt";
import Token from "./Token";

// -----------------

import { useSelector } from "react-redux";

// Getting the redux states

const selectLoading = (state) => state.control.loading;
const selectReceipt = (state) => state.control.receiptOpen;
const selectError = (state) => state.control.errorOpen;

const Dashboard = () => {
  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);
  const openError = useSelector(selectError);
  const openReceipt = useSelector(selectReceipt);

  // Consuming the context

  const { account, tsavings } = useContext(ConnContext);

  // Setting modal states

  const [ownerOpen, setOwnerOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tokenOpen, setTokenOpen] = useState(false);

  // Setting the main div's state

  const [selectedSection, setSelectedSection] = useState(0);

  // State for checking and displaying the owner modal button

  const [isOwner, setIsOwner] = useState(false);

  // State for defining with wich contract to interact

  const [term, setTerm] = useState(true);

  // UseEffect for checking if the current user is owner

  useEffect(() => async () => {
    let towner = await tsavings.methods.owner().call({ from: account });

    if (towner.toLowerCase() === account.toLowerCase()) setIsOwner(true);
  });

  // Savings section

  const savingsOpenHandler = () => {
    setSelectedSection(1);
  };
  const savingsCloseHandler = () => setSelectedSection(0);

  // Withdraw section
  const withdrawOpenHandler = () => {
    setSelectedSection(2);
  };
  const withdrawCloseHandler = () => setSelectedSection(0);

  // Stop savings section

  const stopOpenHandler = () => {
    setSelectedSection(3);
  };
  const stopCloseHandler = () => setSelectedSection(0);

  // Get savings section
  const getOpenHandler = () => {
    setSelectedSection(4);
  };
  const getCloseHandler = () => setSelectedSection(0);

  // Owner panel section

  const openOwnerHandler = () => setOwnerOpen(true);
  const closeOwnerHandler = () => setOwnerOpen(false);

  // Token panel section

  const openTokenHandler = () => setTokenOpen(true);
  const closeTokenHandler = () => setTokenOpen(false);

  // Manual modal section

  const openManualHandler = () => setManualOpen(true);
  const closeManualHandler = () => setManualOpen(false);

  // About modal section

  const aboutCloseHandler = () => setAboutOpen(false);
  const aboutOpenHandler = () => setAboutOpen(true);

  return (
    <LoadingOverlay active={loading} spinner={<Circle />}>
      <div className={classes.main_frame}>
        {/* Header */}

        <div className={classes.header}>
          <button className={classes.manual} onClick={openManualHandler}>
            Savings manual
          </button>

          <h1 className={classes.header_title}>StakeApp</h1>
          <button className={classes.about_us} onClick={aboutOpenHandler}>
            About us
          </button>
        </div>

        {/* Main */}
        {/* Savings section */}
        <div className={classes.main_content}>
          {selectedSection != 1 && (
            <div
              className={`${classes.start_savings} ${classes.animate_fade}`}
              onClick={savingsOpenHandler}
            >
              <span>Start savings</span>
            </div>
          )}
          {selectedSection === 1 && (
            <Savings
              closeSavings={savingsCloseHandler}
              setTerm={setTerm}
              term={term}
              openReceipt={openReceipt}
            />
          )}

          {/* Withdraw Section */}
          {selectedSection != 2 && (
            <div
              className={`${classes.withdraw_savings} ${classes.animate_fade}`}
              onClick={withdrawOpenHandler}
            >
              <p>Withdraw savings</p>
            </div>
          )}
          {selectedSection === 2 && (
            <Withdraw
              closeWithdraw={withdrawCloseHandler}
              setTerm={setTerm}
              term={term}
            />
          )}

          {/* Owner modal section */}
          {ownerOpen && (
            <OwnerPanel
              closeModal={closeOwnerHandler}
              isOpen={ownerOpen}
              setTerm={setTerm}
              term={term}
            />
          )}
          {tokenOpen && (
            <Token
              closeModal={closeTokenHandler}
              isOpen={tokenOpen}
              setTerm={setTerm}
              term={term}
            />
          )}

          {/* Manual modal section */}
          {manualOpen && (
            <Manual closeModal={closeManualHandler} isOpen={manualOpen} />
          )}

          {/* AboutUs modal section */}
          {aboutOpen && (
            <AboutUs closeModal={aboutCloseHandler} isOpen={aboutOpen} />
          )}

          {/* Stop savings section */}
          {selectedSection != 3 && (
            <div
              className={`${classes.stop_savings} ${classes.animate_fade}`}
              onClick={stopOpenHandler}
            >
              <p>Stop savings</p>
            </div>
          )}
          {selectedSection === 3 && <Stop closeStop={stopCloseHandler} />}

          {/* Get savings section */}
          {selectedSection != 4 && (
            <div
              className={`${classes.get_savings} ${classes.animate_fade}`}
              onClick={getOpenHandler}
            >
              <p>Get savings details</p>
            </div>
          )}
          {selectedSection === 4 && (
            <GetSavings
              closeGetSavings={getCloseHandler}
              setTerm={setTerm}
              term={term}
            />
          )}

          {/* Recipt & Error modals */}
          {openReceipt && (
            <Receipt title="Succesful Transaction" isOpen={openReceipt} />
          )}
          {openError && <Error isOpen={openError} term={term} />}
        </div>

        {/* Footer */}
        <div className={classes.footer}>
          {isOwner && (
            <button className={classes.owner} onClick={openOwnerHandler}>
              Owner panel
            </button>
          )}
          {!isOwner && (
            <button className={classes.owner} onClick={openTokenHandler}>
              Token
            </button>
          )}

          <h2 className={classes.footer_title}>StakeApp Ⓒ</h2>
          <button
            className={classes.log_out}
            onClick={() => window.location.reload(false)}
          >
            Log out
          </button>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default Dashboard;
