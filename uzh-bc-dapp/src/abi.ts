export const dapp_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "commitBorrowing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveBorrowing",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "borrowedAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "totalDurationMonths",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "amountLeftToRepay",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "durationMonthsLeft",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "monthlyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interestRate",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "investorAddresses",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "investorAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalInvestorAmount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "deleted",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paidOut",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paidBack",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "withdrawalDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "mostRecentRepaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundingCompletedDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct ActiveBorrowing",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveBorrowingAddresses",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "borrowingAddress",
        "type": "address"
      }
    ],
    "name": "getActiveLendingByAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "borrowedAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "totalDurationMonths",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "amountLeftToRepay",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "durationMonthsLeft",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "monthlyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interestRate",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "investorAddresses",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "investorAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "totalInvestorAmount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "deleted",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paidOut",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paidBack",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "withdrawalDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "mostRecentRepaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundingCompletedDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct ActiveBorrowing",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBorrowingConditions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "monthlyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interestRate",
            "type": "uint256"
          }
        ],
        "internalType": "struct BorrowingConditions",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBorrowingRequest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "durationMonths",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "income",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "expenses",
            "type": "uint256"
          }
        ],
        "internalType": "struct BorrowingRequest",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getInvestments",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "borrowerAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "totalAmountLended",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalAmountLendedWithInterest",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "monthlyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interestRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountPaidBack",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "durationMonthsLeft",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "deleted",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paidBack",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "mostRecentRepaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "totalDurationMonths",
            "type": "uint8"
          }
        ],
        "internalType": "struct Investment[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "borrowTo",
        "type": "address"
      }
    ],
    "name": "investMoney",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPayBackPossible",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "borrowTo",
        "type": "address"
      }
    ],
    "name": "isWithdrawInvestementPossible",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isWithdrawMoneyPossible",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "packBackBorrower",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "provideLiquidityToContract",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "durationMonths",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "income",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expenses",
        "type": "uint256"
      }
    ],
    "name": "requestBorrowing",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "monthlyAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "interestRate",
            "type": "uint256"
          }
        ],
        "internalType": "struct BorrowingConditions",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "setContractTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "borrowTo",
        "type": "address"
      }
    ],
    "name": "withdrawInvestment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawMoney",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
