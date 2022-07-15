const is = artifacts.require("IndefiniteSavings");
const ts = artifacts.require("TermSavings");
const truffleAssert = require("truffle-assertions");

let isavings;
let tsavings;

contract("IndefiniteSavings", (accounts) => {
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  before(async () => {
    isavings = await is.deployed();
  });

  it("Owner should deposit some ETH into the contract", async () => {
    let funds = web3.utils.toBN("10000000000000000000");
    let res = await isavings.fundContract({
      from: accounts[0],
      value: funds,
    });

    truffleAssert.eventEmitted(res, "LogOwnerDeposit", (ev) => {
      return ev.value.toString() === funds.toString();
    });
  });

  it("User should start savings with 1 ETH", async () => {
    let funds = web3.utils.toBN("1000000000000000000");
    let res = await isavings.newDeposit({ from: accounts[1], value: funds });
    truffleAssert.eventEmitted(res, "LogNewDeposit", (ev) => {
      return ev.value.toString() === funds.toString();
    });
  });

  it("User should be a registered staker", async () => {
    let res = await isavings.getDeposit({ from: accounts[1] });
    truffleAssert.eventEmitted(res, "LogGetDeposit", (ev) => {
      return ev.value.toString() === "1000000000000000000";
    });
  });

  it("User should withdraw the deposit and recive the reward & no longer be a staker", async () => {
    await timeout(2000);
    let res = await isavings.withdrawDeposit({ from: accounts[1] });
    truffleAssert.eventEmitted(res, "LogWthDeposit", (ev) => {
      return ev.totalIntrest.gt(ev.value);
    });
  });

  it("Owner withdraws 5 of the available ETH", async () => {
    let withAmount = web3.utils.toBN("5000000000000000000");

    let res = await isavings.withdrawContractFunds(accounts[0], withAmount, {
      from: accounts[0],
    });
    truffleAssert.eventEmitted(res, "LogOwnerWithdraw", (ev) => {
      return ev.withdrawnValue.toString() === withAmount.toString();
    });
  });
});

// For testing purposes change the Term savings time to 30, 60, 90 seconds

contract("TermSavings", (accounts) => {
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  before(async () => {
    tsavings = await ts.deployed();
  });

  it("Owner should deposit some ETH after deployment", async () => {
    let funds = web3.utils.toBN("10000000000000000000");
    let res = await tsavings.fundContract({ from: accounts[0], value: funds });
    truffleAssert.eventEmitted(res, "LogOwnerDeposit", (ev) => {
      return ev.value.toString() === funds.toString();
    });
  });

  it("First user should deposit and choose lockup time of R1", async () => {
    let value = web3.utils.toBN("1000000000000000000");
    let res = await tsavings.newDeposit(1, { from: accounts[1], value: value });
    truffleAssert.eventEmitted(res, "LogNewDeposit", (ev) => {
      return ev.value.toString() === value.toString();
    });
  });

  it("Second user should deposit and choose lockup time of R2", async () => {
    let value = web3.utils.toBN("1000000000000000000");
    let res = await tsavings.newDeposit(2, { from: accounts[2], value: value });
    truffleAssert.eventEmitted(res, "LogNewDeposit", (ev) => {
      return ev.value.toString() === value.toString();
    });
  });

  it("Third user should deposit and choose lockup time of R3", async () => {
    let value = web3.utils.toBN("1000000000000000000");
    let res = await tsavings.newDeposit(3, { from: accounts[3], value: value });
    truffleAssert.eventEmitted(res, "LogNewDeposit", (ev) => {
      return ev.value.toString() === value.toString();
    });
  });

  it("First user should be a staker", async () => {
    let res = await tsavings.getDeposit({ from: accounts[1] });
    truffleAssert.eventEmitted(res, "LogGetDeposit", (ev) => {
      return ev.value.toString() === "1000000000000000000";
    });
  });

  it("Second user should be a staker", async () => {
    let res = await tsavings.getDeposit({ from: accounts[1] });
    truffleAssert.eventEmitted(res, "LogGetDeposit", (ev) => {
      return ev.value.toString() === "1000000000000000000";
    });
  });

  it("Third user should be a staker", async () => {
    let res = await tsavings.getDeposit({ from: accounts[1] });
    truffleAssert.eventEmitted(res, "LogGetDeposit", (ev) => {
      return ev.value.toString() === "1000000000000000000";
    });
  });

  it("The first user should withdraw their funds after R1", async () => {
    await timeout(30000);
    let res = await tsavings.withdrawDeposit({
      from: accounts[1],
    });
    truffleAssert.eventEmitted(res, "LogWthDeposit", (ev) => {
      return ev.sender.toString() === accounts[1].toString();
    });
  });

  it("The second user should withdraw their funds after R2", async () => {
    await timeout(30000);
    let res = await tsavings.withdrawDeposit({ from: accounts[2] });
    truffleAssert.eventEmitted(res, "LogWthDeposit", (ev) => {
      return ev.sender.toString() === accounts[2].toString();
    });
  });

  it("The third user should withdraw their funds after R3", async () => {
    await timeout(30000);
    let res = await tsavings.withdrawDeposit({ from: accounts[3] });
    truffleAssert.eventEmitted(res, "LogWthDeposit", (ev) => {
      return ev.sender.toString() === accounts[3].toString();
    });
  });

  it("Owner withdraws 5 of the available ETH", async () => {
    let withAmount = web3.utils.toBN("5000000000000000000");

    let res = await tsavings.withdrawContractFunds(accounts[0], withAmount, {
      from: accounts[0],
    });
    truffleAssert.eventEmitted(res, "LogOwnerWithdraw", (ev) => {
      return ev.withdrawnValue.toString() === withAmount.toString();
    });
  });
});
