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

  constructor(private scService: SmartContractService) { }

  ngOnInit(): void {
    this.fundingRate = this.borrowing.totalInvestorAmount / this.borrowing.borrowedAmount * 100;
    this.maxInvestment = (this.borrowing.borrowedAmount - this.borrowing.totalInvestorAmount) / 1e18;
    this.risk = (100/(10-2.5))*((this.borrowing.interestRate/100)-2.5)
  }

  invest(): void {
    this.scService.investMoney(this.borrowing.address, this.investmentAmount.value).then(value => {
      this.invested.emit(true);
    })
  }
}
