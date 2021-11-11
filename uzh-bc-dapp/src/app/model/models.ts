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
