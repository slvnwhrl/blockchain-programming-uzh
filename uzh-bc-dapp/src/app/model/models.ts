// Defines the borrowing base values
export class BorrowingRequest{
  // Amount in WEI the user wants to borrow
  amount: number;
  // The duration in month the user wants to pay back the borrowed amount
  durationMonths: number;
  // The income of the user in CHF
  income: number;
  // The total expenses of the user in CHF
  expenses: number;

  constructor(amount: number, durationMonths: number, income: number, expenses: number) {
      this.amount = amount;
      this.durationMonths = durationMonths;
      this.income = income;
      this.expenses = expenses;
  }
}

// Defines the borrowing conditions
export class BorrowingConditions {
  // Amount to pay back monthly
  monthlyAmount: number;

  // Interest Rate on whole amount
  interestRate: number;

  constructor(monthlyAmount: number, interestRate: number) {
    this.monthlyAmount = monthlyAmount;
    this.interestRate = interestRate;
  }
}

// Defines the parameters of an active borrowing contract betweed a borrower and one or more investors.
export class ActiveBorrowing {
  // Borrowed amount in WEI
  borrowedAmount: number;

  // Total duration of repayment in months
  totalDurationMonths: number;

  // Amount left to repay
  amountLeftToRepay: number;

  // Duration left in months
  durationMonthsLeft: number;

  // Amount to pay back monthly
  monthlyAmount: number;

  // Interest Rate on whole amount
  interestRate: number;

  // List of addresses of the investors
  investorAddresses: string[];

  // List of WEI each investor lended
  investorAmounts: number[];

  // Total amount of WEI all investors lended
  totalInvestorAmount: number;

  // Flag to check if instance is deleted
  deleted: boolean;

  // Flag to check if money was withdrawn
  payedOut: boolean;

  // Flag to check if instance is fully payed back
  payedBack: boolean;

  // Date of withdrawal (start of repayment period)
  withdrawalDate: number;

  // Date of most recent repayment
  mostRecentRepaymentDate: number;

  // address temp field
  address: string

  constructor(borrowedAmount: number, totalDurationMonths: number, amountLeftToRepay: number, durationMonthsLeft: number, monthlyAmount: number, interestRate: number, investorAddresses: string[], investorAmounts: number[], totalInvestorAmount: number, deleted: boolean, payedOut: boolean, payedBack: boolean, withdrawalDate: number, mostRecentRepaymentDate: number) {
    this.borrowedAmount = borrowedAmount;
    this.totalDurationMonths = totalDurationMonths;
    this.amountLeftToRepay = amountLeftToRepay;
    this.durationMonthsLeft = durationMonthsLeft;
    this.monthlyAmount = monthlyAmount;
    this.interestRate = interestRate;
    this.investorAddresses = investorAddresses;
    this.investorAmounts = investorAmounts;
    this.totalInvestorAmount = totalInvestorAmount;
    this.deleted = deleted;
    this.payedOut = payedOut;
    this.payedBack = payedBack;
    this.withdrawalDate = withdrawalDate;
    this.mostRecentRepaymentDate = mostRecentRepaymentDate;
  }
}

// Defines the parameters of an investment contract betweed a borrower and an investors.
export class Investment{
  // Address of the borrower
  borrowerAddress: string;

  // Total amount in WEI lended to the borrowe
  totalAmountLended: number;

  // Total amount in WEI lended including the added interest
  totalAmountLendedWithInterest: number;

  // Monthly amount in WEI to be payed back
  monthlyAmount: number;

  // Interest Rate on whole amount
  interestRate: number;

  // Amount already payed back
  amountPayedBack: number;

  // Duration left in months
  durationMonthsLeft: number;

  // Flag to check if instance is deleted
  deleted: boolean;

  // Flag to check if instance is fully payed back
  payedBack: boolean;

  // Date of investment start
  startDate: number;

  // Date of most recent repayment
  mostRecentRepaymentDate: number;

  constructor(borrowerAddress: string, totalAmountLended: number, totalAmountLendedWithInterest: number, monthlyAmount: number, interestRate: number, amountPayedBack: number, durationMonthsLeft: number, deleted: boolean, payedBack: boolean, startDate: number, mostRecentRepaymentDate: number) {
    this.borrowerAddress = borrowerAddress;
    this.totalAmountLended = totalAmountLended;
    this.totalAmountLendedWithInterest = totalAmountLendedWithInterest;
    this.monthlyAmount = monthlyAmount;
    this.interestRate = interestRate;
    this.amountPayedBack = amountPayedBack;
    this.durationMonthsLeft = durationMonthsLeft;
    this.deleted = deleted;
    this.payedBack = payedBack;
    this.startDate = startDate;
    this.mostRecentRepaymentDate = mostRecentRepaymentDate;
  }
}
