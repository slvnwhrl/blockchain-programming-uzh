import {Component, Input, OnInit} from '@angular/core';
import {ActiveBorrowing, Investment} from "../../../model/models";

@Component({
  selector: 'app-investment-displayer',
  templateUrl: './investment-displayer.component.html',
  styleUrls: ['./investment-displayer.component.scss']
})
export class InvestmentDisplayerComponent implements OnInit {
  @Input()
  investment: Investment;
  risk: number;
  payedBackRate: number

  constructor() { }

  ngOnInit(): void {
    this.risk = (100/(10-2.5))*((this.investment.interestRate/100)+1-2.5);
    this.payedBackRate = (1 - (this.investment.totalAmountLendedWithInterest - this.investment.amountPayedBack)/(this.investment.totalAmountLendedWithInterest))*100;
  }

}
