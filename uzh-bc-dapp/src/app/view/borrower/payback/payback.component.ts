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
  constructor(private scService: SmartContractService) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.monthlyAmount = parseInt(this.activeBorrowing.monthlyAmount);
    this.totalWithInterest = this.activeBorrowing.totalInvestorAmount * ((100 + this.activeBorrowing.interestRate / 100) / 100);
    this.payedBackRate = ((this.totalWithInterest - this.activeBorrowing.amountLeftToRepay)/(this.totalWithInterest))*100;
    this.fundingRate = this.activeBorrowing.totalInvestorAmount / this.activeBorrowing.borrowedAmount * 100;
  }

  checkIfPaymentPossible() {
    this.scService.isPayBackPossible().then(value => {
      this.paymentPossible = value;
      this.paymentPossibleChecked = true;
    });
  }

  payBack() {
    // const s = new BN(this.activeBorrowing.monthlyAmount.toString(), 10);
    // const s = new BN(this.activeBorrowing.monthlyAmount, 10);
    this.loading = true;
    this.scService.packBackBorrower(this.activeBorrowing.monthlyAmount).then(value => {
        this.payedBackMonthlySuccess = value;
        this.scService.getActiveBorrowing().then(value1 => {
          this.activeBorrowing = value1;
          this.initData();
          this.loading = false;
        })
    });
  }

  withdrawMoney() {
    this.loading = true;
    this.scService.withdrawMoney().then(value => {
      this.scService.getActiveBorrowing().then(value1 => {
        this.activeBorrowing = value1;
        this.loading = false;
        this.initData();
      })
    })

  }
}
