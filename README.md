# StakeAppGoerli
A savings dApp on deployed on Goerli testnet

StakeApp is a dApp that is deployed on the Goerli testnet and is available on the following link: 
-------------------------------------------------------------------------------------------------
https://savingsapp-c9b15.web.app/
-------------------------------------------------------------------------------------------------

=== Solidity backend ===
StakeApp is comprised of 2 smart contracts, one for term and one for idenfinite savings, with the addition of AddressSet library by Rob Hitchens
which is used for CRUD operations inside the contracts. All Solidity code is written and compiled in 0.8.0v. Along with the contracts there are
also truffle test that have been written to test the main functionalities of contracts. Every interaction with the contract emits a event at the
end which is later consumed by the fronted to produce a desireable UX and provide substantial feedback.

=== ReactJS frontend ===
StakeApp is available on desktop and mobile. For use of the desktop version a Metmask wallet and extension is needed, while on mobile a Metamask
browser or other Ethereum-enabled browsers are required. React frontend interacts with Goerli Testnet through utilization of the web3 library and
injected Metamask provider. After a user submits a transaction, it is signed using his metmask credentials and sent to be included in the next block.
After getting the transaction confirmation, events that were emitted after a transaction are gathered and processed. After a succesful transaction
the user is presented with a receipt containing all of the details of a transaction.

=======================
All of the code in this repository is well-commented and available for easy review.
