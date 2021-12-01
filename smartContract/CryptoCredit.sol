// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Defines the borrowing base values 
struct BorrowingRequest {
    // Amount in WEI the user wants to borrow
    uint256 amount;
    
    // The duration in month the user wants to pay back the borrowed amount
    uint8 durationMonths;
    
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

// Defines the parameters of an active borrowing contract between a borrower and one or more investors.
struct ActiveBorrowing {
    // Borrowed amount in WEI
    uint256 borrowedAmount;
    
    // Total duration of repayment in months
    uint8 totalDurationMonths;
    
    // Amount left to repay
    uint256 amountLeftToRepay;
    
    // Duration left in months 
    uint8 durationMonthsLeft;
    
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
    
    // Flag to check if money was withdrawn
    bool paidOut;
    
    // Flag to check if instance is fully paid back
    bool paidBack;
    
    // Date of withdrawal (start of repayment period)
    uint256 withdrawalDate;
    
    // Date of most recent repayment
    uint256 mostRecentRepaymentDate;
    
    // Date of completing the funding
    uint256 fundingCompletedDate;
}

// Defines the parameters of an investment contract betweed a borrower and an investors.
struct Investment{
    // Address of the borrower
    address borrowerAddress;
    
    // Total amount in WEI lended to the borrowe
    uint256 totalAmountLended;
    
    // Total amount in WEI lended including the added interest
    uint256 totalAmountLendedWithInterest;
    
    // Monthly amount in WEI to be paid back
    uint256 monthlyAmount;
    
     // Interest Rate on whole amount
    uint256 interestRate;
    
    // Amount already paid back
    uint256 amountPaidBack;
    
    // Duration left in months 
    uint256 durationMonthsLeft;
    
    // Flag to check if instance is deleted
    bool deleted;
    
    // Flag to check if instance is fully paid back
    bool paidBack;
    
    // Date of investment start
    uint256 startDate;
    
    // Date of most recent repayment
    uint256 mostRecentRepaymentDate;

    // Total duration of repayment in months
    uint8 totalDurationMonths;
}

contract CryptoCredit{
    
    address owner;
    
    mapping(address => BorrowingRequest) borrowingRequests;
    mapping(address => BorrowingConditions) borrowingConditions;
    mapping(address => ActiveBorrowing) activeBorrowings;
    mapping(address => Investment[]) investments;
    // Mapping from investor to index of an investment from a specific borrower in investments mapping
    mapping(address => mapping(address => uint128)) investorToActiveInvestment;
    // Mapping from a borrower to a specific investor address in investorAddresses (in ActiveBorrowing struct)
    mapping(address => mapping(address => uint128)) borrowerToActiveInvestor;
    
    address[] activeBorrowingAddresses;
    
    /*  Serves as internal representation of block.timestamp. Since we want to test out contract, 
        we need to be able to advance time. In a real world example, we would always use block.timestamp
    */
    uint256 currentTime;

    event BorrowingFundingChanged(address borrowerAddress);
    event InvestmentPaybackChanged(address[] investorAddresses);
    event InvestmentWithdrawn(address borrowerAddress);
    event MoneyWithdrawn(address[] investorAddresses);

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
    function requestBorrowing(uint256 amount, uint8 durationMonths, uint256 income, uint256 expenses) public {
        require(canRequestBorrowing(msg.sender), "Cannot receive funding for more than one active project");
        require(durationMonths <= 120, "Duration cannot be longer than 10 years");
        require(income > expenses, "Income must be bigger than expenses");
        
        BorrowingRequest memory borrowingRequest = BorrowingRequest(amount, durationMonths, income, expenses);
        
        // Reset calculated borrowing conditions on new borrowing request
        borrowingConditions[msg.sender].monthlyAmount = 0;
        borrowingConditions[msg.sender].interestRate = 0;
        
        borrowingRequests[msg.sender] = borrowingRequest;
        
        calculateBorrowingConditions();
    }
    
    /*
    Allows to check if a user can request a borrowing. Can only request a borrowing if there are no open borrowings.
    returns: bool
    */
    function canRequestBorrowing(address borrowTo) private view returns (bool) {
        if (activeBorrowings[borrowTo].borrowedAmount > 0) {
            if (activeBorrowings[borrowTo].deleted == false && (activeBorrowings[borrowTo].paidOut == false || activeBorrowings[borrowTo].amountLeftToRepay > 0)) {
                return false;
            }
        }
        return true;
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
    function calculateBorrowingConditions() private returns (BorrowingConditions memory) {
        require (borrowingRequests[msg.sender].amount > 0, "No open borrowing request");
        
        if (borrowingConditions[msg.sender].monthlyAmount > 0) {
            return borrowingConditions[msg.sender];
        } else {
            BorrowingRequest memory borrowingRequest = borrowingRequests[msg.sender];
            
            // Calculate the net income and scale to wei
            // We assume an ETH price of CHF 4000 (this would need to be connected to an oracle)
            uint256 netIncome = 1e18 * (borrowingRequest.income - borrowingRequest.expenses) / 4000;
            
            uint256 monthlyPayback = borrowingRequest.amount / borrowingRequest.durationMonths;
            
            // Multiply with 1000 to get a int number which represents a float with precision of 3. Divide income difference by monthly payback.
            uint256 netIncToDebtRation = (1000 * netIncome/monthlyPayback);

            // The income difference must be at least 25% bigger than the monthly payback rate
            require(netIncToDebtRation >= 1250, "Not allowed to borrow money with current parameters");

            uint256 calculatedRate;
            // If the income difference is at least 3x bigger than the monthly payback rate, the minimum rate (2%) applies
            if (netIncToDebtRation >= 3000) {
                calculatedRate = 200;
            }
            // In this case, the rate is calculated linearly depending on the ratio of net income and debt (monthly payback rate)
            // rate represents a float with precision of 2 (as an integer)
            else {
                calculatedRate = (15714186 - 4571*netIncToDebtRation)/10000;
            }
            
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
            borrowingRequests[msg.sender].amount * (10000 + borrowingConditions[msg.sender].interestRate) / 10000, 
            borrowingRequests[msg.sender].durationMonths, 
            borrowingConditions[msg.sender].monthlyAmount, 
            borrowingConditions[msg.sender].interestRate,
            investorAdresses, 
            investorAmounts,
            0,
            false,
            false,
            false,
            0,
            0,
            0);
        activeBorrowings[msg.sender] = activeBorrowing;
        
        // Save address of user to activeBorrowingAddresses, so it can be retrieved by possible investors
        activeBorrowingAddresses.push(msg.sender);

        // Reset borrowing request and borrowing conditions
        borrowingRequests[msg.sender].amount = 0;
        borrowingRequests[msg.sender].durationMonths = 0;
        borrowingRequests[msg.sender].income = 0;
        borrowingRequests[msg.sender].expenses = 0;
        borrowingConditions[msg.sender].monthlyAmount = 0;
        borrowingConditions[msg.sender].interestRate = 0;
    }
    
    /*
        Allows user to withdraw the requested money if the project is already funded and not paid out yet.
    */
    function withdrawMoney() public {
        require (activeBorrowings[msg.sender].borrowedAmount == activeBorrowings[msg.sender].totalInvestorAmount && !activeBorrowings[msg.sender].paidOut, "Not allowed to withdraw money");
        require (address(this).balance >= activeBorrowings[msg.sender].borrowedAmount, "Not enough liquidity");
        address payable addr = payable(msg.sender);
        
        activeBorrowings[msg.sender].paidOut = true;
        activeBorrowings[msg.sender].withdrawalDate = currentTime;
        addr.transfer(activeBorrowings[msg.sender].borrowedAmount);
        
        // For every investor find the according investment and set the start date
        for (uint i = 0; i < activeBorrowings[msg.sender].investorAddresses.length; i++){
            investments[activeBorrowings[msg.sender].investorAddresses[i]][investorToActiveInvestment[activeBorrowings[msg.sender].investorAddresses[i]][msg.sender]].startDate = currentTime;
        }

        emit MoneyWithdrawn(activeBorrowings[msg.sender].investorAddresses);
        
        // Remove address from activeBorrowingAddresses, since it does not need funding anymore
        for (uint k = 0; k < activeBorrowingAddresses.length; k++) {
            if(activeBorrowingAddresses[k] == msg.sender) {
                activeBorrowingAddresses[k] = activeBorrowingAddresses[activeBorrowingAddresses.length-1];
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
        require (activeBorrowings[msg.sender].borrowedAmount > 0 && !activeBorrowings[msg.sender].paidOut , "No active borrowing agreement");
        if (activeBorrowings[msg.sender].borrowedAmount == activeBorrowings[msg.sender].totalInvestorAmount) {
            return true;
        } else {
            return false;
        }
    }
    
   /*
        Allows the user to check wheter paying back debt is possible
        returns: wheter paying back is possible
    */
    function isPayBackPossible() public view returns (bool){
        require (activeBorrowings[msg.sender].borrowedAmount > 0 && activeBorrowings[msg.sender].paidOut , "No active borrowing agreement");
        require (activeBorrowings[msg.sender].amountLeftToRepay > 0 || !activeBorrowings[msg.sender].paidBack , "Already paid back");
        
        if (activeBorrowings[msg.sender].mostRecentRepaymentDate != 0 && activeBorrowings[msg.sender].mostRecentRepaymentDate + 21 days < currentTime) {
            return true;
        } else if (activeBorrowings[msg.sender].mostRecentRepaymentDate == 0 && activeBorrowings[msg.sender].withdrawalDate + 21 days < currentTime) {
            return true;
        // special case: payments in residue > 1
        } else if ((activeBorrowings[msg.sender].totalDurationMonths - activeBorrowings[msg.sender].durationMonthsLeft) < 
        (currentTime - activeBorrowings[msg.sender].withdrawalDate)/60/60/24/30) {
            return true;
        }
        else {
            return false;
        }
    }
    
    /*
        Allows the owner of the contract to provide additional liquidity
        returns: providing liquidity successful or not
    */
    function packBackBorrower() payable public returns (bool success){
        require (isPayBackPossible(), "Payback not possible");
        require (msg.value == activeBorrowings[msg.sender].monthlyAmount, "Not the correct amount to pay back");
        
        // For every investor find the according investment and set the start date
        uint128 invIndex;
        for (uint i = 0; i < activeBorrowings[msg.sender].investorAddresses.length; i++){
            invIndex = investorToActiveInvestment[activeBorrowings[msg.sender].investorAddresses[i]][msg.sender];

            investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].amountPaidBack += investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].monthlyAmount;
            // TODO: Check with months left
            investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].durationMonthsLeft -= 1;
            investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].mostRecentRepaymentDate = currentTime;
            address payable addr = payable(activeBorrowings[msg.sender].investorAddresses[i]);
            addr.transfer(investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].monthlyAmount);
            if(investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].amountPaidBack == investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].totalAmountLendedWithInterest){
                investments[activeBorrowings[msg.sender].investorAddresses[i]][invIndex].paidBack = true;
            }
        }

        emit InvestmentPaybackChanged(activeBorrowings[msg.sender].investorAddresses);
         
        // TODO: Check with months left
        activeBorrowings[msg.sender].amountLeftToRepay -= msg.value;
        activeBorrowings[msg.sender].durationMonthsLeft -= 1;
        activeBorrowings[msg.sender].mostRecentRepaymentDate = currentTime;
        
        if(activeBorrowings[msg.sender].amountLeftToRepay == 0) {
            activeBorrowings[msg.sender].paidBack = true;
        }
        return true;
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
        Allows user to retrieve investments
        returns: list of investments
    */
    function getInvestments() public view returns (Investment[] memory)  {
        return investments[msg.sender];
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
         // Make sure investment is not too small and not too big
         require(msg.value > 0, "No investment provided");
         require(activeBorrowings[borrowTo].borrowedAmount >= activeBorrowings[borrowTo].totalInvestorAmount, "Already enough money lended");
         uint256 investedAmount;
         if (activeBorrowings[borrowTo].borrowedAmount - activeBorrowings[borrowTo].totalInvestorAmount < msg.value) {
             investedAmount = activeBorrowings[borrowTo].borrowedAmount - activeBorrowings[borrowTo].totalInvestorAmount;
         }
         else {
             investedAmount = msg.value;
         }
    
        // Investor rate (fixed precision float) minus 1% (-100)
        uint256 investorRate = (10000 + activeBorrowings[borrowTo].interestRate - 100);
        

        bool invFound = investments[msg.sender].length > 0 && 
        investments[msg.sender][investorToActiveInvestment[msg.sender][borrowTo]].paidBack == false &&
        investments[msg.sender][investorToActiveInvestment[msg.sender][borrowTo]].deleted == false;

        // Already invested
        if (invFound) {
            activeBorrowings[borrowTo].investorAmounts[borrowerToActiveInvestor[borrowTo][msg.sender]] += investedAmount;
        }
        // Not yet invested
        if(!invFound) {
            Investment memory investment = Investment(
                borrowTo,
                investedAmount,
                investorRate * investedAmount / 10000,
                investorRate * investedAmount / 10000 / activeBorrowings[borrowTo].totalDurationMonths,
                activeBorrowings[borrowTo].interestRate - 100,
                0,
                activeBorrowings[borrowTo].totalDurationMonths,
                false,
                false,
                0,
                0,
                activeBorrowings[borrowTo].totalDurationMonths);
                
                investments[msg.sender].push(investment);
                investorToActiveInvestment[msg.sender][borrowTo] = uint128(investments[msg.sender].length - 1); 
        
                activeBorrowings[borrowTo].investorAddresses.push(msg.sender);
                activeBorrowings[borrowTo].investorAmounts.push(investedAmount);
                borrowerToActiveInvestor[borrowTo][msg.sender] = uint128(activeBorrowings[borrowTo].investorAddresses.length -1);
        }
        activeBorrowings[borrowTo].totalInvestorAmount += investedAmount;
        
        if (activeBorrowings[borrowTo].totalInvestorAmount == activeBorrowings[borrowTo].borrowedAmount) {
            activeBorrowings[borrowTo].fundingCompletedDate = currentTime;
        }
        emit BorrowingFundingChanged(borrowTo);
        
        // Return unused money
        if (investedAmount < msg.value) {
            address payable addr = payable(msg.sender);
            addr.transfer(msg.value - investedAmount);
        }
        
        return true;
    }
    
    /*
    Allows a user to check if investment in funded (but not paid out) project can be withdrawn.
    returns: bool
    */
    function isWithdrawInvestmentPossible(address borrowTo) public view returns (bool) {
        // Frist check if investor has an active investment with borrowTo
        if (investments[msg.sender].length == 0 ||
        investments[msg.sender][investorToActiveInvestment[msg.sender][borrowTo]].totalAmountLended == 0 ||
        investments[msg.sender][investorToActiveInvestment[msg.sender][borrowTo]].paidBack == true || 
        investments[msg.sender][investorToActiveInvestment[msg.sender][borrowTo]].deleted == true) {
            return false;
        }

        if (activeBorrowings[borrowTo].borrowedAmount == activeBorrowings[borrowTo].totalInvestorAmount && activeBorrowings[borrowTo].paidOut == false &&
        (currentTime - activeBorrowings[borrowTo].fundingCompletedDate)/60/60/24 >= 30) {
            return true;
        }
        return false;
    }
    
    /*
    Withdraw investment from a funded (but not paid out) project. All investors will receive their investment back.
    */
    function withdrawInvestment(address borrowTo) public {
        require(isWithdrawInvestmentPossible(borrowTo), "Investment can only be withdrawn, if a borrower doesn't withdraw money from a fully funded project for at least 30 days.");
        
        address payable addr;
        for(uint i = 0; i < activeBorrowings[borrowTo].investorAddresses.length; i++) {
            addr = payable(activeBorrowings[borrowTo].investorAddresses[i]);
            addr.transfer(activeBorrowings[borrowTo].investorAmounts[i]);
            investments[activeBorrowings[borrowTo].investorAddresses[i]][investorToActiveInvestment[activeBorrowings[borrowTo].investorAddresses[i]][borrowTo]].deleted = true;
        }
        activeBorrowings[borrowTo].deleted = true;
        emit InvestmentWithdrawn(borrowTo);
        
        // Remove address from activeBorrowingAddresses, since it does not need funding anymore
        for (uint k = 0; k < activeBorrowingAddresses.length; k++) {
            if(activeBorrowingAddresses[k] == borrowTo) {
                activeBorrowingAddresses[k] = activeBorrowingAddresses[activeBorrowingAddresses.length-1];
                activeBorrowingAddresses.pop();
                break;
            }
        }
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
    
    /*
        Returns contract internal time
        returns: timestamp
    */
    function getContractTime() public view returns (uint256)  {
        return currentTime;
    }
    
    /*
        set contract internal time (only for testing purposes)
        returns: timestamp
    */
    function setContractTime(uint256 timestamp) public  {
        currentTime = timestamp;
    }
    
}