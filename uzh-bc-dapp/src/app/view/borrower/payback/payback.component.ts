import {Component, Input, OnInit} from '@angular/core';
import {ActiveBorrowing} from "../../../model/models";
import {SmartContractService} from "../../../service/smart-contract.service";
import BN from "bn.js";

@Component({
  selector: 'app-payback',
  templateUrl: './payback.component.html',
  styleUrls: ['./payback.component.scss']
})
export class PaybackComponent implements OnInit {

  @Input()
  activeBorrowing: ActiveBorrowing;
  payedBackRate: number;
  totalWithInterest: number;
  paymentPossible: boolean = false;
  paymentPossibleChecked: boolean = false;
  payedBackMonthlySuccess: boolean = false;
  fundingRate: number;
  monthlyAmount: number;
  loading = false;

  /**
   * Construct the Payback Component
   * @param scService Reference to the Smart Contract Service
   */
  constructor(private scService: SmartContractService) { }

  /**
   * Load data
   */
  ngOnInit(): void {
    this.initData();
  }

  /**
   * Calculate funding rate, payed-back rate, total with interest and monthly amount
   */
  initData(): void {
    this.monthlyAmount = parseInt(this.activeBorrowing.monthlyAmount);
    this.totalWithInterest = this.activeBorrowing.totalInvestorAmount * ((100 + this.activeBorrowing.interestRate / 100) / 100);
    this.payedBackRate = ((this.totalWithInterest - this.activeBorrowing.amountLeftToRepay)/(this.totalWithInterest))*100;
    this.fundingRate = this.activeBorrowing.totalInvestorAmount / this.activeBorrowing.borrowedAmount * 100;
  }

  /**
   * Check if payment of monthly amount is possible
   */
  checkIfPaymentPossible() {
    this.scService.isPayBackPossible().then(value => {
      this.paymentPossible = value;
      this.paymentPossibleChecked = true;
    });
  }

  /**
   * Pay back money to investors and reload data
   */
  payBack() {
    this.loading = true;
    this.scService.packBackBorrower(this.activeBorrowing.monthlyAmount).then(value => {
        this.payedBackMonthlySuccess = value;
        this.scService.getActiveBorrowing().then(value1 => {
          this.activeBorrowing = value1;
          this.initData();
          this.scService.emitError('');
          this.loading = false;
        });
    }, () => {
      this.scService.emitError('Payback aborted or not successful.');
      this.loading = false;
    });
  }

  /**
   * Withdraw initial money from borrowing
   */
  withdrawMoney() {
    this.loading = true;
    this.scService.withdrawMoney().then(value => {
      this.scService.getActiveBorrowing().then(value1 => {
        this.activeBorrowing = value1;
        this.loading = false;
        this.initData();
        this.scService.emitError('');
      });
    }, () => {
      this.loading = false;
      this.scService.emitError('Withdrawal aborted or not successful.');
    });
  }
}
