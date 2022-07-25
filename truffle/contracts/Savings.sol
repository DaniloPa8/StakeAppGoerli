// SPDX-License-Identifier: UNLICNESED
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol"; // @dev Library for setting ownership
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
/**
 * @notice Key sets with enumeration and delete. Uses mappings for random
 * and existence checks and dynamic arrays for enumeration. Key uniqueness is enforced. 
 * @dev Sets are unordered. Delete operations reorder keys. All operations have a 
 * fixed gas cost at any scale, O(1). 
 * author: Rob Hitchens
 */

library AddressSet {
    
    struct Set {
        mapping(address => uint) keyPointers; // @dev UserStruct
        address[] keyList; // @dev UserIndex
    }


    /**
     * @notice insert a key. 
     * @dev duplicate keys are not permitted.
     * @param self storage pointer to a Set. 
     * @param key value to insert.
     */    
    function insert(Set storage self, address key) public {
        require(!exists(self, key), "4001 | This address is already a registered staker.");
        self.keyPointers[key] = self.keyList.length;
        self.keyList.push(key);
    }

    /**
     * @notice remove a key.
     * @dev key to remove must exist. 
     * @param self storage pointer to a Set.
     * @param key value to remove.
     */    
    function remove(Set storage self, address key) internal {
        require(exists(self, key), "5001 | This address is not a registered staker.");
        uint last = count(self) - 1;
        uint rowToReplace = self.keyPointers[key];
        if(rowToReplace != last) {
            address keyToMove = self.keyList[last];
            self.keyPointers[keyToMove] = rowToReplace;
            self.keyList[rowToReplace] = keyToMove;
        }
        delete self.keyPointers[key];
       self.keyList.pop();
    }

    /**
     * @notice check if a key is in the Set.
     * @param self storage pointer to a Set.
     * @param key value to check. 
     * @return bool true: Set member, false: not a Set member.
     */  
    function exists(Set storage self, address key) internal view returns(bool) {
        if(self.keyList.length == 0) return false;
        return self.keyList[self.keyPointers[key]] == key;
    }
      function count(Set storage self) internal view returns(uint) {
        return(self.keyList.length);
    }
}

contract SavingsToken is Context, ERC20 {
    constructor() ERC20("StakeApp Token", "SAT") {
        _mint(msg.sender, 100000000 * 10 ** 18);         //adjust the first number to adjust totalSupply
    }

}

contract TermSavings is Ownable{

    // @dev Defining the use for AddressSet library

    using AddressSet for AddressSet.Set;
    AddressSet.Set depositSet;

    IERC20 private _token;

  constructor (IERC20 token)  {
        _token = token;
    }

    struct DepositStruct {
        uint8 plan;
        uint256 value;                  // @dev struct used for user info here is all information execpt unique ID
        uint256 depositTime;            
        uint256 withdrawalTime;         
        uint256 totalIntrest;
    }

    mapping(address => DepositStruct) deposits; // @dev used for saving the unique ID which will be the address of the user
   
    // @dev defining events which are used for front-end feedback

    event LogNewDeposit(address sender, uint8 plan, uint256 depositedValue, uint256 depositTime, uint256 withdrawalTime, uint256 totalIntrest);
    event LogRemDeposit(address sender,uint256 withdrawnValue,uint256 depositedValue, uint256 time);
    event LogWthDeposit(address sender, uint256 depositedValue, uint256 totalIntrest, uint256 time);
    event LogGetDeposit(address sender,  uint256 depositedValue, uint8 plan, uint256 depositTime, uint256 withdrawalTime,uint256 totalIntrest,  uint256 time);
    event LogOwnerDeposit(address sender, uint256 fundedValue);
    event LogOwnerWithdraw(address sender, uint256 withdrawnValue);
    
    // @dev a helper function for checking if the address is already a registered staker

    function isStaker () public view returns (bool)  {
        require(depositSet.exists(msg.sender), "5001 | This address is not a registered staker.");
        return true;
    }

    // @dev a helper function for returning the contract balance

     function getBalance  () external view returns (uint256) {
        return _token.balanceOf(address(this)); // balance of the smart contract
    } 
    
    // @dev function for starting new savings
    // @params _plan for choosing the savings plan (1,2,3)

    function newDeposit(uint8 _plan, uint256 _amount) external {
        require (_plan == 1 || _plan == 2 || _plan == 3, "5004 | Plan selected is out of range."); 
        require(!depositSet.exists(msg.sender), "4001 | You are already a registered staker.");
        
        _token.transferFrom(msg.sender, address(this), _amount);

        depositSet.insert(msg.sender); 
        DepositStruct storage d = deposits[msg.sender];
        
        d.plan = _plan;

        d.depositTime = block.timestamp;
                
        d.value = _amount;
        
        if (_plan == 1) {
            d.withdrawalTime = block.timestamp + 60;//7889229; // 3 months, 7889229 UNIX TIMESTAMP {production value}, this value can be changed
            d.totalIntrest = d.value + ((d.value / 100) * 3);   // to demonstrate the withdrawDeposit function, set this to few seconds    
        }
        else if (_plan == 2) {
            d.withdrawalTime = block.timestamp + 120;//15778458; // 6 months, 15778458 UNIX TIMESTAMP {production value} this value can be changed
            d.totalIntrest = d.value + ((d.value / 100) * 6); // to demonstrate the withdrawDeposit function, set this to few seconds
        }
        else if (_plan == 3) {
            d.withdrawalTime = block.timestamp + 180;//31556916; // 9 months, 31556916 UNIX TIMESTAMP {production value} this value can be changed
            d.totalIntrest = d.value + ((d.value / 100) * 9); // to demonstrate the withdrawDeposit function, set this to few seconds
        }
        emit LogNewDeposit(msg.sender, _plan, d.value, d.depositTime, d.withdrawalTime, d.totalIntrest);
    }
    
    // @dev a function for terminating savings early

    function stopSavings() external  {
        
        isStaker();
        
        DepositStruct storage d = deposits[msg.sender];
        
        require(block.timestamp < d.withdrawalTime, "5002 | Your savings term has exipred, please withdraw the funds using the 'withdrawDeposit' function");
       
        address reciver = msg.sender;

        _token.approve(reciver, d.value - ((d.value/100) * 5));
        _token.transfer(reciver, d.value - ((d.value/100) * 5));
              
        emit LogRemDeposit(msg.sender, d.value - ((d.value/100) * 5), d.value, block.timestamp );

        depositSet.remove(msg.sender); 
        delete deposits[msg.sender];
    }
    
    // @dev function for getting the savings details

    function getDeposit() external  {
        
        isStaker();
       
        DepositStruct storage d = deposits[msg.sender];
   
        emit LogGetDeposit(msg.sender, d.value, d.plan, d.depositTime, d.withdrawalTime, d.totalIntrest,  block.timestamp);
    }
    
    // @dev function for withdrawing the savings after the term has expired

    function withdrawDeposit()  external {
        isStaker();
   
        DepositStruct storage d = deposits[msg.sender];
  
        require(block.timestamp > d.withdrawalTime , "5003 | Withdrawal time has not expired yet");

        address reciver = msg.sender;

        _token.approve(reciver, d.totalIntrest);
        _token.transfer(reciver, d.totalIntrest);
            
        emit LogWthDeposit(msg.sender,d.value, d.totalIntrest,  block.timestamp);
            
        depositSet.remove(msg.sender); // This will fail automatically if the key doesn't exist
        delete deposits[msg.sender];        
    }

     function withdrawContractFunds (address  _reciver, uint256 _value) external onlyOwner {
        
        _token.approve(_reciver, _value);
        _token.transfer(_reciver, _value);

        emit LogOwnerWithdraw(_reciver, _value);
    }
    function fundContract(uint256 _amount) external  onlyOwner {

        _token.transferFrom(msg.sender,address(this), _amount);

        emit LogOwnerDeposit(msg.sender, _amount);
    }
    
         
}

contract IndefiniteSavings is Ownable{
 
    // @dev defining a use for AddressSet library

    using AddressSet for AddressSet.Set;
    AddressSet.Set depositSet;

    IERC20 private _token;
    uint256 giveawayPool;


    constructor (IERC20 token)  {
        _token = token;
    }
  
    struct DepositStruct {
        uint256 value;                  // @dev struct for storing staker data
        uint256 depositTime;
    }

    mapping(address => DepositStruct) deposits; // @dev a mapping for storing the address's as the IDs/keys

    // @dev helper function to get the contract

    function getBalance  () external view returns (uint256) {
       return _token.balanceOf(address(this)); 
    }
    function getGiveawayPool () external view returns (uint256) {
        return giveawayPool;
    }

    // @dev a helper function for checking if the address is already a registered staker

    function isStaker () public view returns(bool) {
        require(depositSet.exists(msg.sender), "5001 | This address is not a registered staker.");
        return true;
    }

    // @dev defining events

    event LogWthDeposit (address sender,  uint256 depositedValue,uint256 totalIntrest, uint256 time);
    event LogNewDeposit (address sender,  uint256 depositedValue, uint256 depositTime);
    event LogGetDeposit(address sender,  uint256 depositedValue, uint256 depositTime, uint256 time);
    event LogOwnerDeposit(address sender, uint256 fundedValue);
    event LogOwnerWithdraw(address sender, uint256 withdrawnValue);
    event LogGiveaway(address sender, uint256 giveawayValue);
    event LogFundGiveaway(address sender, uint256 giveawayFunds);
    event LogWithdrawGiveaway(address sender, uint256 giveawayAmount);
    // @dev function for starting new savings

    function newDeposit(uint256 _amount) external  {
       
        require(!depositSet.exists(msg.sender), "4001 | You are already a registered staker.");

        _token.transferFrom(msg.sender,address(this), _amount);

        depositSet.insert(msg.sender); // Note that this will fail automatically if the key already exists.
       
        DepositStruct storage d = deposits[msg.sender];
       
        d.value = _amount;
        d.depositTime = block.timestamp;
       
        emit LogNewDeposit(msg.sender, d.value, d.depositTime); 
    }
    function getDeposit()  external  {
        
        isStaker();
               
        DepositStruct storage d = deposits[msg.sender];
       
        emit LogGetDeposit(msg.sender, d.value, d.depositTime, block.timestamp);
    }
    function withdrawDeposit() external  {

        isStaker();
        
        DepositStruct storage d = deposits[msg.sender];
        
        uint256 totalIntrest = d.value + ((block.timestamp - d.depositTime) * ( (d.value / 100) / 2629743)); // @dev calculating total amount for payout, intrest per second
        
        uint256 time = block.timestamp;
     
        address reciver = msg.sender;
        _token.approve(reciver, totalIntrest);
        _token.transfer(reciver, totalIntrest);
        
        emit LogWthDeposit (msg.sender, d.value, totalIntrest, time);
        
        depositSet.remove(msg.sender);
        delete deposits[msg.sender];   
    }

    function withdrawContractFunds (address _reciver, uint256 _value) external  onlyOwner {
    
        _token.approve(_reciver, _value);
        _token.transfer(_reciver, _value);
        
        emit LogOwnerWithdraw(_reciver, _value);
    }
    function fundContract(uint256 _amount) external  onlyOwner {
    
        _token.transferFrom(msg.sender,address(this), _amount);
        emit LogOwnerDeposit(msg.sender, _amount);       
    }
    function giveaway() external {
        require(giveawayPool >100000000000000000000, "9005 | No funds in giveaway pool" );
        address reciver = msg.sender;
        _token.approve(reciver,100000000000000000000 );
        _token.transfer(reciver,100000000000000000000);
        giveawayPool = giveawayPool - 100000000000000000000;

        emit LogGiveaway(msg.sender, 100000000000000000000);
    }
    function fundGiveaway() external onlyOwner {
        _token.transferFrom(msg.sender, address(this), 10000000000000000000000);
        giveawayPool = giveawayPool + 10000000000000000000000;

        emit LogFundGiveaway(msg.sender, giveawayPool);
    }
    function withdrawGiveaway() external onlyOwner {
        _token.approve(msg.sender, giveawayPool);
        _token.transfer(msg.sender, giveawayPool);
        uint256 withdrawn = giveawayPool;
        giveawayPool = 0;
        
        emit LogWithdrawGiveaway(msg.sender, withdrawn);
    }
}