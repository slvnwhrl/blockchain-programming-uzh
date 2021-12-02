# UZH Blockchain Seminar - CryptoCredit

## Idea
This repository contains the code for a decentralized app (DApp) that runs on the [Ethereum network](https://ethereum.org/en/). The DApp acts as a platform to connect users interested in borrowing ETH (borrowers) with users willing to lend ETH to a borrower (lenders). More precisely, a borrower can request a specific amount of ETH for a specifiedduration of time.  Should the borrower accept the credit conditions,  i.e.  the interest rate and monthly paybackrate, the request is made available for funding by lenders. Lenders receive an interest on their investments tocompensate for their financial risk. 

## Structure
The repository involves two major components: 
- A smart contract containing thelogic for borrowing and lending ETH. This smart contract can be found in the [smartContract](https://github.com/slvnwhrl/blockchain-programming-uzh/tree/main/smartContract) folder.
- A web-based front end used to interact with the smart contract. The front end is based on the [AngularJS](https://angularjs.org) framework. The code can be found in the [uzh-bc-dapp](https://github.com/slvnwhrl/blockchain-programming-uzh/tree/main/uzh-bc-dapp) folder. This folder also contains a [README](https://github.com/slvnwhrl/blockchain-programming-uzh/tree/main/uzh-bc-dapp#uzh-blockchain-seminar---cryptocredit) describing how to deploy & run the application.
