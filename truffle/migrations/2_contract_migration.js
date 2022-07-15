const TermSavings = artifacts.require("TermSavings");
const IndefiniteSavings = artifacts.require("IndefiniteSavings");
const AddressSet = artifacts.require("AddressSet");
const Token = artifacts.require("SavingsToken");
module.exports = function (deployer) {
  deployer.deploy(AddressSet);
  deployer.link(AddressSet, IndefiniteSavings);
  deployer.link(AddressSet, TermSavings);
  deployer.deploy(Token).then(function () {
    return (
      deployer.deploy(IndefiniteSavings, Token.address),
      deployer.deploy(TermSavings, Token.address)
    );
  });
};
