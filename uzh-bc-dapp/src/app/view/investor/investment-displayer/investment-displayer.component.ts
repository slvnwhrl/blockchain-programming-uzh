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
  loading = false;

  /**
   * Construct the Investor Displayer Component
   * @param scService Reference to the Smart Contract Service
   */
  constructor(private scService: SmartContractService) { }

  /**
   * Init the component. Calculate risk and payed-back rate.
   */
  ngOnInit(): void {
    this.risk = (100/(9-1))*((this.investment.interestRate/100)+1-1);
    this.payedBackRate = (1 - (this.investment.totalAmountLendedWithInterest - this.investment.amountPayedBack)/(this.investment.totalAmountLendedWithInterest))*100;
    if(!this.investment.payedBack){
      this.scService.isWithdrawInvestmentPossible(this.investment.borrowerAddress).then(value => {
        this.isWithdrawPossible = value;
      });
    }

  }

  /**
   * Withdraw Investment and emit event to parent component
   */
  withdrawInvestment(): void{
    this.loading = true;
    this.scService.withdrawInvestment(this.investment.borrowerAddress).then(value => {
      this.withdrawn.emit(true);
      this.loading = false;
    }, () => {
      this.withdrawn.emit(false);
      this.loading = false;
    })
  }

}
