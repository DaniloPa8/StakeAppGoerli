import React from "react";

// Context storing the current user account and both contract instances

const ConnContext = React.createContext({
  account: String,
  tsavings: Object,
  isavings: Object,
  token: Object,
});

export default ConnContext;
