import React from "react";
import classes from "./../styles/TermSelector.module.css";

// a simple component for selecting with which contract user wants to interact

const TermSelector = (props) => {
  return (
    <>
      <span
        className={`${classes.title} ${props.term ? classes.choosenL : ""}`}
        onClick={() => props.setTerm(true)}
      >
        Term savings
      </span>

      <span
        className={`${classes.text} ${!props.term ? classes.choosenR : ""}`}
        onClick={() => props.setTerm(false)}
      >
        Indefinite savings
      </span>
    </>
  );
};

export default TermSelector;
