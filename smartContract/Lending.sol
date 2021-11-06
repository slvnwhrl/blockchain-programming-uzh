// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Defines the borrowing base values 
struct BorrowingRequest {
    // Amount in WEI the user wants to borrow
    uint256 amount;
    
    // The duration in month the user wants to pay back the borrowed amount
    uint256 durationMonths;
    
    // The income of the user in CHF
    uint256 income;
    
    // The total expenses of the user in CHF
    uint256 expenses;
}

// Defines the borrowing conditions 
struct BorrowingConditions {
    // Amount to pay back monthly
    uint256 monthlyAmount;
    
    // Interest Rate on whole amount
    uint256 interestRate;
}

// Defines the parameters of an active borrowing contract betweed a borrower and one or more investors.
struct ActiveBorrowing {
    // Borrowed amount in WEI
    uint256 borrowedAmount;
    
    // Total duration of repayment in months
    uint256 totalDurationMonths;
    
    // Amount left to repay
    uint256 amountLeftToRepay;
    
    // Duration left in months 
    uint256 durationMonthsLeft;
    
    // Amount to pay back monthly
    uint256 monthlyAmount;
    
    // Interest Rate on whole amount
    uint256 interestRate;
    
    // List of addresses of the investors
    address[] investorAddresses;
    
    // List of WEI each investor lended
    uint256[] investorAmounts;
    
    // Total amount of WEI all investors lended
    uint256 totalInvestorAmount;
    
    // Flag to check if instance is deleted
    bool deleted;
    
    // Flag to check if instance is fully payed back
    bool payedOut;
    
    // Date of withdrawal (start of repayment period)
    uint256 withdrawalDate;
    
    // Date of most recent repayment
    uint256 mostRecentRepaymentDate;
}

struct ActiveInvestment{
    address borrowerAddress;
    uint256 totalAmountLended;
    uint256 totalAmountLendedWithReturn;
    uint256 monthlyAmount;
    uint256 amountLeftToReceive;
    // Duration left in months 
    uint256 durationMonthsLeft;
    uint256 lastPaymentDate;
    bool softDeleted;
    bool payedBack;
}

contract Lending {
    
    address owner;
    
    mapping(address => BorrowingRequest) borrowingRequests;
    mapping(address => BorrowingConditions) borrowingConditions;
    mapping(address => ActiveBorrowing) activeBorrowings;
    mapping(address => ActiveInvestment[]) activeInvestments;
    
    address[] activeBorrowingAddresses;
    
    uint256 currentTime;
    
    constructor() {
       owner = msg.sender;
       currentTime = block.timestamp;
    }
    
    
    /* 
        Allows any user to request the borrowing of ETH. The request data is stored in a mapping to the users address.
        uint256 amount: amount in WEI the user wants to borrow
        uint256 durationMonths: the duration in month the user wants to pay back the borrowed amount
        uint256 income: the income of the user in CHF
        uint256 expenses: the total expenses of the user in CHF
    */
    function requestBorrowing(uint256 amount, uint256 durationMonths, uint256 income, uint256 expenses) public {
        BorrowingRequest memory borrowingRequest = BorrowingRequest(amount, durationMonths, income, expenses);
        
        // Reset calculated borrowing conditions on new borrowing request
        borrowingConditions[msg.sender].monthlyAmount = 0;
        borrowingConditions[msg.sender].interestRate = 0;
        
        borrowingRequests[msg.sender] = borrowingRequest;
    }
    
    
    /*
        Returns the current borrowing request of the user
        returns: borrowing request
    */
    function getBorrowingRequest() public view returns (BorrowingRequest memory)  {
        return borrowingRequests[msg.sender];
    }
    
    /*
        Calculates borrowing conditions based on borrowing request of the user
        returns: borrowing conditions
    */
    function calculateBorrowingConditions() public returns (BorrowingConditions memory)  {
        require (borrowingRequests[msg.sender].amount > 0, "No open borrowing request");
        
        if (borrowingConditions[msg.sender].monthlyAmount > 0) {
            return borrowingConditions[msg.sender];
        } else {
            BorrowingRequest memory borrowingRequest = borrowingRequests[msg.sender];
            
            // Calculate the income difference and scale to wei
            uint256 incomeDifference = (borrowingRequest.income - borrowingRequest.expenses) * 1e18;
            
            // Multiply borrowing amount in ETH with ETH Price in CHF (we assume 4000CHF per ETH, this would need to be connected to an oracle) and divide by duration in months
            uint256 monthlyPayback = borrowingRequest.amount * 4000 / borrowingRequest.durationMonths;
            
            // Multiply with 10000 to get a int number which represents a float with precision of 2. Divide monthly payback by income difference and by 2.
            uint256 calculatedRate = (10000 * monthlyPayback/incomeDifference/2);
            
            // Only allow to borrow money when interest rate between 2.5% and 10%
            require (calculatedRate >= 250 && calculatedRate <= 1000, "Not allowed to borrow money with current parameters");
            
            // Multiply requested amount with 10000 + calculatedRate (fixed precision float) and divide by total duration and by 10000 to get monthly amount in WEI
            uint256 monthlyAmount = (borrowingRequest.amount * (10000 + calculatedRate)) / borrowingRequest.durationMonths / 10000;
            
            
            BorrowingConditions memory conditions = BorrowingConditions(monthlyAmount, calculatedRate);
            borrowingConditions[msg.sender] = conditions;
            return borrowingConditions[msg.sender];
        }
     }
    
    
    
    /*
        Returns borrowing conditions of a user
        returns: borrowing conditions
    */
    function getBorrowingConditions() public view returns (BorrowingConditions memory)  {
        require (borrowingConditions[msg.sender].monthlyAmount > 0, "No calculated borrowing conditions");
        return borrowingConditions[msg.sender];
    }
    
    /*
        Commit the borrowing conditions, so investors can fund the request
    */
    function commitBorrowing() public {
        require (borrowingRequests[msg.sender].amount > 0, "No open borrowing request");
        require (borrowingConditions[msg.sender].monthlyAmount > 0, "No calculated borrowing conditions");
        
        // Create ActiveBorrowing entity
        address[] memory investorAdresses;
        uint256[] memory investorAmounts;
        ActiveBorrowing memory activeBorrowing = ActiveBorrowing(
            borrowingRequests[msg.sender].amount, 
            borrowingRequests[msg.sender].durationMonths,
            borrowingRequests[msg.sender].amount, 
            borrowingRequests[msg.sender].durationMonths, 
            borrowingConditions[msg.sender].monthlyAmount, 
            borrowingConditions[msg.sender].interestRate,
            investorAdresses, 
            investorAmounts,
            0,
            false,
            false,
            0,
            0);
        activeBorrowings[msg.sender] = activeBorrowing;
        
        // Save address of user to activeBorrowingAddresses, so it can be retrieved by possible investors
        activeBorrowingAddresses.push(msg.sender);
    }
    
    /*
        Allows user to withdraw the requested money if the project is already funded and not payed out yet.
    */
    function withdrawMoney() public {
        require (activeBorrowings[msg.sender].borrowedAmount == activeBorrowings[msg.sender].totalInvestorAmount && !activeBorrowings[msg.sender].payedOut, "No allowed to withdraw money");
        require (address(this).balance >= activeBorrowings[msg.sender].borrowedAmount, "Not enough liquidity");
        address payable addr = payable(msg.sender);
        
        // TOOD: GAS ATTACK check
        
        activeBorrowings[msg.sender].payedOut = true;
        addr.transfer(activeBorrowings[msg.sender].borrowedAmount);
        
        // TODO: Create LenderStruct
        
        
        // Remove address from activeBorrowingAddresses, since it does not need funding anymore
        for (uint j = 0; j < activeBorrowingAddresses.length; j++) {
            if(activeBorrowingAddresses[j] == msg.sender) {
                activeBorrowingAddresses[j] = activeBorrowingAddresses[activeBorrowingAddresses.length-1];
                activeBorrowingAddresses.pop();
                break;
            }
        }
    }
    
    /*
        Allows the user to check wheter withdrawal of money is possible
        returns: wheter withdrawal of money is possible
    */
    function isWithdrawMoneyPossible() public view returns (bool){
        require (activeBorrowings[msg.sender].borrowedAmount > 0 && !activeBorrowings[msg.sender].payedOut , "No active borrowing agreement");
        if (activeBorrowings[msg.sender].borrowedAmount == activeBorrowings[msg.sender].totalInvestorAmount) {
            return true;
        } else {
            return false;
        }
    }
    

    
    /*
        Allows user to retrieve active borrowing conditions
        returns: active borrowing conditions
    */
    function getActiveBorrowing() public view returns (ActiveBorrowing memory)  {
        return activeBorrowings[msg.sender];
    }
    
    /*
        Allows user to retrieve active borrowing addresses
        returns: list of active borrowing addresses
    */
    function getActiveBorrowingAddresses() public view returns (address[] memory)  {
        return activeBorrowingAddresses;
    }
    
    /*
        Allows user to retrieve active investments
        returns: list of active investments
    */
    function getActiveInvestments() public view returns (ActiveInvestment[] memory)  {
        return activeInvestments[msg.sender];
    }
    
    
    /*
        Allows user to retrieve active borrowing conditions by address
        address borrowingAddress: address of the borrower 
        returns: active borrowing conditions
    */
    function getActiveLendingByAddress(address borrowingAddress) public view returns (ActiveBorrowing memory)  {
        return activeBorrowings[borrowingAddress];
    }
    
    /*
        Allows user to lend money to another user
        address borrowTo: address to lend money to
        returns: wheter lending wa successful
    */
    function investMoney(address borrowTo) payable public returns (bool success){
         //TODO: CHECK NOT TOO MUCH MONEY -> RETURN MONEY BACK
        
        // TODO: Change sturct
        ActiveInvestment memory activeInvestment = ActiveInvestment(
            borrowTo,
            msg.value,
            msg.value * (1 + activeBorrowings[borrowTo].interestRate),
            msg.value * (1 + activeBorrowings[borrowTo].interestRate) / activeBorrowings[borrowTo].totalDurationMonths,
            0,0,false,false);
        activeInvestments[msg.sender].push(activeInvestment);
        
        // TODO: Check, if same investor twice
        activeBorrowings[borrowTo].investorAddresses.push(msg.sender);
        activeBorrowings[borrowTo].investorAmounts.push(msg.value);
        activeBorrowings[borrowTo].totalInvestorAmount += msg.value;
        return true;
    }
    
    /*
        Allows the owner of the contract to provide additional liquidity
        returns: providing liquidity successful or not
    */
    function provideLiquidityToContract() payable public returns (bool success){
        return true;
    }
    
    /*
        Returns the current contract liquidity
        returns: contract liquidity
    */
    function getContractLiquidity() public view returns (uint256)  {
        return address(this).balance;
    }
    
}