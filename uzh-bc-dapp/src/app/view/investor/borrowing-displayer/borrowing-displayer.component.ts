import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActiveBorrowing} from "../../../model/models";
import {FormControl} from "@angular/forms";
import {SmartContractService} from "../../../service/smart-contract.service";

@Component({
  selector: 'app-borrowing-displayer',
  templateUrl: './borrowing-displayer.component.html',
  styleUrls: ['./borrowing-displayer.component.scss']
})
export class BorrowingDisplayerComponent implements OnInit {


  @Input()
  borrowing: ActiveBorrowing;

  @Output()
  invested: EventEmitter<boolean> = new EventEmitter<boolean>();

  fundingRate: number;
  risk: number;
  maxInvestment: number;
  investmentAmount: FormControl = new FormControl(0.1);
  loading = false;

  /**
   * Construct the Borrowing Displayer Component
   * @param scService Reference to the Smart Contract Service
   */
  constructor(private scService: SmartContractService) { }

  /**
   * Init component. Calculate funding rate, max investment and risk
   */
  ngOnInit(): void {
    this.fundingRate = this.borrowing.totalInvestorAmount / this.borrowing.borrowedAmount * 100;
    this.maxInvestment = (this.borrowing.borrowedAmount - this.borrowing.totalInvestorAmount) / 1e18;
    this.risk = (100/(9-1))*((this.borrowing.interestRate/100)-1)
  }

  /**
   * Invest money and emit event to parent component
   */
  invest(): void {
    this.loading = true;
    this.scService.investMoney(this.borrowing.address, this.investmentAmount.value).then(value => {
      this.invested.emit(true);
      this.loading = false;
    }, () => {
      this.invested.emit(false);
      this.loading = false;
    })
  }
}
