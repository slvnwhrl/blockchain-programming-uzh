import {Component, OnInit} from '@angular/core';
import {SmartContractService} from "../../service/smart-contract.service";
import {ActiveBorrowing, BorrowingConditions, BorrowingRequest} from "../../model/models";

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.scss']
})
export class BorrowerComponent implements OnInit {

  step = -1;
  loading = false;
  isConnected = false;
  error: string = '';
  borrowingConditions: BorrowingConditions;
  activeBorrowing: ActiveBorrowing;

  constructor(private scService: SmartContractService) {
  }

  ngOnInit(): void {
    // TODO: Proper network check
    this.scService.error$.subscribe(value => {
      this.error = value;
      if (value == '') {
        this.checkStep();
      }
    })
    if (!this.scService.isConnected()) {
      this.scService.connectAccount().then(value => {
        this.isConnected = true
        this.checkStep();
      });
    } else {
      this.isConnected = true
      this.checkStep();
    }

  }

  checkStep(): void {
    this.loading = true;
    this.scService.getActiveBorrowing().then(value => {
      if (value.payedBack == false && value.borrowedAmount > 0) {
        this.step = 2;
        this.activeBorrowing = value;
        this.loading = false
      } else {
        this.scService.getBorrowingRequest().then(value => {
          console.log(value);
          console.log(value.amount === 0 && value.durationMonths === 0 && value.expenses === 0 && value.income === 0);
          if (value.amount === 0 && value.durationMonths === 0 && value.expenses === 0 && value.income === 0) {
            this.step = 0;
            this.loading = false;
          } else {
            this.scService.getBorrowingConditions().then(value1 => {
              this.borrowingConditions = value1;
              this.step = 1;
              this.loading = false;
            })
          }
        })
      }
    })

  }

  connectManually() {
    this.scService.connectAccount().then(value => {
      this.isConnected = true
    });
  }

  requestQuote($event: BorrowingRequest) {
    this.loading = true;
    this.scService.requestBorrowing($event.amount, $event.durationMonths, $event.income, $event.expenses).then(value => {
      this.borrowingConditions = value;
      this.step = 1;
      this.loading = false;
    }, (err) => {
      console.log(err)
    });
  }
}
