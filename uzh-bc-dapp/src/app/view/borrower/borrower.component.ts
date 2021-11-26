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
  borrowingConditions: BorrowingConditions;
  activeBorrowing: ActiveBorrowing;

  constructor(private scService: SmartContractService, private changeDetector: ChangeDetectorRef) {
    this.scService.borrowingFunded$.subscribe(value => {
      // debugger;
      if(value) {
        // window.location.reload();
        //TODO: try fix

        this.step = -1;
        this.activeBorrowing = null;
        this.loading = true;
        this.changeDetector.detectChanges();
        this.scService.getActiveBorrowing().then(value1 => {
          console.log('loaded');
          this.activeBorrowing = value1;
          this.step = 2;
          this.loading = false;
          this.changeDetector.detectChanges();
        });
      }
    })
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
      this.scService.getBorrowingConditions().then(value1 => {
        this.borrowingConditions = value1;
        this.step = 1;
        this.loading = false;
      }, (err1)=> {
        console.log(err1)
      });
    }, (err) => {
      console.log(err)
    });
  }

  committed($event: boolean) {
    this.checkStep();
  }
}
