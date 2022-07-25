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
import Sidebar from "./Sidebar";

// -----------------

import { useSelector } from "react-redux";

// Getting the redux states

const selectLoading = (state) => state.control.loading;
const selectReceipt = (state) => state.control.receiptOpen;
const selectError = (state) => state.control.errorOpen;
const selectInput = (state) => state.control.waitingForInput;

// Component

const Dashboard = () => {
  //setting Redux states with the Selector

  const loading = useSelector(selectLoading);
  const openError = useSelector(selectError);
  const openReceipt = useSelector(selectReceipt);
  const waitingForInput = useSelector(selectInput);

  // Consuming the context

  const { account, tsavings } = useContext(ConnContext);

  // Setting modal states

  const [ownerOpen, setOwnerOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tokenOpen, setTokenOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Setting the main div's state

  const [selectedSection, setSelectedSection] = useState(0);

  // State for checking and displaying the owner modal button

  const [isOwner, setIsOwner] = useState(false);

  // State for defining with witch contract to interact

  const [term, setTerm] = useState(true);

  // UseEffect for checking if the current user is owner

  useEffect(() => {
    if (
      process.env.REACT_APP_OWNER_ADDR.toLowerCase() === account.toLowerCase()
    )
      setIsOwner(true);
  }, []);

  // Savings section

  const savingsOpenHandler = () => {
    setSelectedSection(1);
    if (menuOpen) setMenuOpen(false);
  };

  // Withdraw section
  const withdrawOpenHandler = () => {
    setSelectedSection(2);
    if (menuOpen) setMenuOpen(false);
  };

  // Stop savings section

  const stopOpenHandler = () => {
    setSelectedSection(3);
    if (menuOpen) setMenuOpen(false);
  };

  // Get savings section
  const getOpenHandler = () => {
    setSelectedSection(4);
    if (menuOpen) setMenuOpen(false);
  };
  // Close handler
  const closeMainHandler = () => setSelectedSection(0);

  // Owner panel section
  const ownerHandler = () => setOwnerOpen((prev) => !prev);

  // Token panel section
  const tokenHandler = () => setTokenOpen((prev) => !prev);

  // Manual modal section
  const manualHandler = () => setManualOpen((prev) => !prev);

  // About modal section
  const aboutHandler = () => setAboutOpen((prev) => !prev);

  //Mobile menu
  const menuHandler = () => {
    setMenuOpen((prev) => !prev);
    closeMainHandler();
  };

  return (
    // Overlay
    <LoadingOverlay
      active={loading}
      spinner={<Circle className={classes.loading_overlay_content} />}
      text={`${
        waitingForInput
          ? "Waiting for user to sign the transaction..."
          : "Waiting for transaction execution on blockchain. Please wait..."
      }`}
      className="_loading_overlay_spinner"
    >
      <div
        className={menuOpen ? classes.main_frame_menu_open : classes.main_frame}
      >
        {/* Sidebar */}
        <Sidebar
          menuHandler={menuHandler}
          ownerHandler={ownerHandler}
          tokenHandler={tokenHandler}
          aboutHandler={aboutHandler}
          manualHandler={manualHandler}
          menuOpen={menuOpen}
          isOwner={isOwner}
        />

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
              closeSavings={closeMainHandler}
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
              closeWithdraw={closeMainHandler}
              setTerm={setTerm}
              term={term}
            />
          )}

          {/* Owner modal section */}
          {ownerOpen && (
            <OwnerPanel
              closeModal={ownerHandler}
              isOpen={ownerOpen}
              setTerm={setTerm}
              term={term}
            />
          )}
          {/* Token modal section */}
          {tokenOpen && (
            <Token
              closeModal={tokenHandler}
              isOpen={tokenOpen}
              setTerm={setTerm}
              term={term}
            />
          )}

          {/* Manual modal section */}
          {manualOpen && (
            <Manual closeModal={manualHandler} isOpen={manualOpen} />
          )}

          {/* AboutUs modal section */}
          {aboutOpen && (
            <AboutUs closeModal={aboutHandler} isOpen={aboutOpen} />
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
          {selectedSection === 3 && <Stop closeStop={closeMainHandler} />}

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
              closeGetSavings={closeMainHandler}
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
      </div>
    </LoadingOverlay>
  );
};

export default Dashboard;
