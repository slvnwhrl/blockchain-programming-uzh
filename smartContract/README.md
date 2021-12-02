# UZH Blockchain Seminar - CryptoCredit

This folder contains the code for the smart contract that is used in this project. Functions and events in the contract are documented using the recommended [NatSpec](https://docs.soliditylang.org/en/v0.8.10/natspec-format.html) format. For an overview of all available public functions have a look at the source code or check the list below. 

## ABI Overview

### `requestBorrowing(uint256 amount, uint8 durationMonths, uint256 income, uint256 expenses)` (public)

Allows any user to request the borrowing of ETH. The request data is stored in a mapping to the users address.




### `getBorrowingRequest() → struct BorrowingRequest` (public)

Returns the current borrowing request of the user




### `getBorrowingConditions() → struct BorrowingConditions` (public)

Get the borrowing conditions of the sender




### `commitBorrowing()` (public)

Commit the borrowing conditions, so investors can fund the request.



### `withdrawMoney()` (public)

Allows a user to withdraw the requested money if the project is already funded and not paid out yet.



### `isWithdrawMoneyPossible() → bool` (public)

Allows a user to check whether withdrawal of money is possible.




### `isPayBackPossible() → bool` (public)

Allows a user to check whether paying back debt is possible.




### `packBackBorrower() → bool success` (public)

Allows a a user who has borrowed money to pay back the monthly rate.




### `getActiveBorrowing() → struct ActiveBorrowing` (public)

Allows a user to retrieve the borrowing conditions of an active credit.




### `getActiveBorrowingAddresses() → address[]` (public)

 Allows a user to retrieve then addresses of all users with an active credit.




### `getInvestments() → struct Investment[]` (public)

Allows a user to retrieve her previous and active investments.




### `getActiveLendingByAddress(address borrowingAddress) → struct ActiveBorrowing` (public)

Allows a user to retrieve active borrowing conditions by address.




### `investMoney(address borrowTo) → bool success` (public)

Allows a user to lend money to another user.




### `isWithdrawInvestmentPossible(address borrowTo) → bool` (public)

Allows a user to check if investment in funded (but not paid out) project can be withdrawn.




### `withdrawInvestment(address borrowTo)` (public)

Withdraw investment from a funded (but not paid out) project. All investors will receive their investment back.




### `provideLiquidityToContract() → bool success` (public)

Allows to provide additional liquidity to the contract




### `getContractLiquidity() → uint256` (public)

Returns the current contract liquidity.




### `getContractTime() → uint256` (public)

Get the contract's internal time




### `setContractTime(uint256 timestamp)` (public)

Sets the contract's internal time (only for testing purposes)




### `BorrowingFundingChanged(address borrowerAddress)`

Event that emits address of a borrower when funding of respective credit has changed.



### `InvestmentPaybackChanged(address[] investorAddresses)`

Event that emits address of investor that have received money after borrower payback.



### `InvestmentWithdrawn(address borrowerAddress)`

Event that emits address of the owner of a credit from which investment has been withdrawn.



### `MoneyWithdrawn(address[] investorAddresses)`

Event that emits address of investors of a credit after borrower has withdrawn money.





