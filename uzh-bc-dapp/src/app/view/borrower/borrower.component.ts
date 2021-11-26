import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  warn: string = '';
  borrowingConditions: BorrowingConditions;
  activeBorrowing: ActiveBorrowing;

  constructor(private scService: SmartContractService, private changeDetector: ChangeDetectorRef) {
    this.scService.borrowingFundingChanged$.subscribe(value => {
      if (value) {
        this.step = -1;
        this.activeBorrowing = null;
        this.loading = true;
        this.changeDetector.detectChanges();
        this.scService.getActiveBorrowing().then(value1 => {
          this.activeBorrowing = value1;
          this.step = 2;
          this.loading = false;
          this.changeDetector.detectChanges();
        });
      }
    });
    this.scService.investmentWithdrawn$.subscribe(value => {
      if (value) {
        this.step = -1;
        this.activeBorrowing = null;
        this.changeDetector.detectChanges();
        this.checkStep();
        this.changeDetector.detectChanges();
      }
    });
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
      if (value.payedBack == false && value.borrowedAmount > 0 && value.deleted == false) {
        this.step = 2;
        this.activeBorrowing = value;
        this.loading = false
      } else if (value.fundingCompletedDate > 0 && value.deleted == true) {
        this.warn = 'Investors have withdrawn their money from your last request, since you did not withdraw the money within a month.';
        this.step = 0;
        this.loading = false;
      }
      else {
        this.scService.getBorrowingRequest().then(value => {
          if (value.amount === 0 && value.durationMonths === 0 && value.expenses === 0 && value.income === 0) {
            this.step = 0;
            this.loading = false;
          } else {
            this.scService.getBorrowingConditions().then(value1 => {
              this.borrowingConditions = value1;
              this.step = 1;
              this.loading = false;
            }, () => {
              this.error = 'Could not load borrowing conditions of user. Please try again or contact customer service!';
              this.loading = false;
            })
          }
        }, () => {
          this.error = 'Could not load borrowing request of user. Please try again or contact customer service!';
          this.loading = false;
        })
      }
    }, () => {
      this.error = 'Could not load active borrowing contracts of user. Please try again or contact customer service!';
      this.loading = false;
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
      this.warn = '';
      this.scService.getBorrowingConditions().then(value1 => {
        this.borrowingConditions = value1;
        this.step = 1;
        this.loading = false;
      }, () => {
        this.error = 'Could not load borrowing conditions. Please try again or contact customer service!';
        this.loading = false;
        this.reset();
      });
    }, (err) => {
      console.log(err)
      if (err?.message.includes('Not allowed to borrow money with current parameters')) {
        this.error = 'You cannot borrow money with the parameters provided. Either the borrowing amount is to large, or the income-expense difference to low.';
      } else {
        this.error = 'Something went wrong with requesting a quote. Please try again or contact customer service!';
      }
      this.loading = false;
      this.reset();
    });
  }

  committed($event: boolean) {
    this.loading = true;
    this.scService.commitBorrowing().then(value => {
      this.loading = false;
      this.checkStep();
    }, () => {
      this.error = 'Something went wrong with committing. Please try again or contact customer service!';
      this.loading = false;
      this.reset();
    });
  }

  reset(): void {
    this.step = -1;
    this.activeBorrowing = null;
    this.changeDetector.detectChanges();
    this.checkStep();
  }
}
