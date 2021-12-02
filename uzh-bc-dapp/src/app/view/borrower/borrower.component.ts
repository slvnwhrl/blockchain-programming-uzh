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

  /**
   * Construct the Borrowing Component. Subscribe to smart contract events
   * @param scService Reference to the Smart Contract Service
   * @param changeDetector Reference to the change detector
   * */
  constructor(private scService: SmartContractService, private changeDetector: ChangeDetectorRef) {
    this.scService.borrowingFundingChanged$.subscribe(value => {
      if(value){
        window.location.reload();
      }
    });
    this.scService.investmentWithdrawn$.subscribe(value => {
      if(value){
        window.location.reload();
      }
    });
    this.scService.error$.subscribe(value => {
      this.error = value;
      if (value == '') {
        this.checkStep();
      }
    });
    this.scService.warn$.subscribe(value => {
      this.warn = value;
    });
  }


  /**
   * Init component. Check if account is connected.
   */
  ngOnInit(): void {
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

  /**
   * Checks in which borrowing step the user is currently at. Load according data and display according components
   */
  checkStep(): void {
    this.loading = true;
    this.scService.getActiveBorrowing().then(value => {
      if (value.payedBack == false && value.borrowedAmount > 0 && value.deleted == false) {
        this.step = 2;
        this.activeBorrowing = value;
        this.loading = false
      } else if (value.fundingCompletedDate > 0 && value.deleted == true) {
        this.warn += ' Investors have withdrawn their money from your last request, since you did not withdraw the money within a month.';
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

  /**
   * Connect to wallet provider manually
   */
  connectManually() {
    this.scService.connectAccount().then(value => {
      this.isConnected = true
    });
  }

  /**
   * Callback when requesting a borrowing. Requests Borrowing and calculates borrowing conditions.
   * @param $event BorrowingRequest Data from the user
   */
  requestQuote($event: BorrowingRequest) {
    this.loading = true;
    this.scService.requestBorrowing($event.amount, $event.durationMonths, $event.income, $event.expenses).then(value => {
      this.warn = '';
      this.error = '';
      this.scService.getBorrowingConditions().then(value1 => {
        this.error = '';
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
        this.error = 'You cannot borrow money with the parameters provided. Either the borrowing amount is to large, or the income-expense difference is to low.';
      } else {
        this.error = 'Something went wrong with requesting a quote. Please try again or contact customer service!';
      }
      this.loading = false;
      this.reset();
    });
  }

  /**
   * Callback when user committed to the borrowing.
   * @param $event whether commitment was successful
   */
  committed($event: boolean) {
    this.loading = true;
    this.scService.commitBorrowing().then(value => {
      this.loading = false;
      this.error = '';
      this.checkStep();
    }, () => {
      this.error = 'Something went wrong with committing. Please try again or contact customer service!';
      this.loading = false;
      this.reset();
    });
  }

  /**
   * Reset the component
   */
  reset(): void {
    this.step = -1;
    this.activeBorrowing = null;
    this.changeDetector.detectChanges();
    this.checkStep();
  }
}
