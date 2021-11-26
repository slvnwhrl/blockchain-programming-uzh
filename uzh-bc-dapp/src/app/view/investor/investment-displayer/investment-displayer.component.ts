import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActiveBorrowing, Investment} from "../../../model/models";
import {SmartContractService} from "../../../service/smart-contract.service";

@Component({
  selector: 'app-investment-displayer',
  templateUrl: './investment-displayer.component.html',
  styleUrls: ['./investment-displayer.component.scss']
})
export class InvestmentDisplayerComponent implements OnInit {
  @Input()
  investment: Investment;

  @Output()
  withdrawn: EventEmitter<boolean> = new EventEmitter<boolean>();
  risk: number;
  payedBackRate: number
  isWithdrawPossible: boolean;

  constructor(private scService: SmartContractService) { }

  ngOnInit(): void {
    this.risk = (100/(10-2.5))*((this.investment.interestRate/100)+1-2.5);
    this.payedBackRate = (1 - (this.investment.totalAmountLendedWithInterest - this.investment.amountPayedBack)/(this.investment.totalAmountLendedWithInterest))*100;
    console.log(this.investment);
    this.scService.isWithdrawInvestementPossible(this.investment.borrowerAddress).then(value => {
      console.log(value);
      this.isWithdrawPossible = value;
    })
  }

  withdrawInvestment(): void{
    this.scService.withdrawInvestment(this.investment.borrowerAddress).then(value => {
      this.withdrawn.emit(true);
    })
  }

}
