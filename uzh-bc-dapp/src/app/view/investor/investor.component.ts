import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SmartContractService} from "../../service/smart-contract.service";
import {ActiveBorrowing, Investment} from "../../model/models";

@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.scss']
})
export class InvestorComponent implements OnInit {

  loadingOpportunities = false;
  loadingInvestments = false;
  activeBorrowings: ActiveBorrowing[] = [];
  investments: Investment[] = [];
  error: string = '';
  warn: string = '';

  /**
   * Construct the Investor Component. Subscribe to smart contract events.
   * @param scService Reference to the Smart Contract Service
   */
  constructor(private scService: SmartContractService) {
    this.scService.borrowingFundingChanged$.subscribe(value => {
      if (value) {
        window.location.reload();
      }
    });
    this.scService.investmentPaybackChanged$.subscribe(value => {
      if (value) {
        window.location.reload();
      }
    });
    this.scService.moneyWithdrawn$.subscribe(value => {
      if (value) {
        window.location.reload();
      }
    });
    this.scService.investmentWithdrawn$.subscribe(value => {
      if (value) {
        window.location.reload();
      }
    });
    this.scService.error$.subscribe(value => {
      this.error = value;
    });
    this.scService.warn$.subscribe(value => {
      this.warn = value;
    });
  }

  /**
   * Init the component. Load data.
   */
  ngOnInit(): void {
    this.loadOpportunitiesData();
    this.loadInvestmentData();
  }

  /**
   * Load investment opportunities. (=Active borrowings that are not fully funded, not deleted, and not from the same account)
   */
  loadOpportunitiesData(): void {
    this.loadingOpportunities = true;
    this.activeBorrowings = [];
    this.scService.getActiveBorrowingAddresses().then(value => {
      value.forEach((val: string, key: any, arr: any)  => {

        this.scService.getActiveBorrowingByAddress(val).then(value1 => {
          if(value1.payedOut != true && value1.address != this.scService.getConnectedAccount() && value1.totalInvestorAmount != value1.borrowedAmount && value1.deleted == false){
            this.activeBorrowings.push(value1);
          }
        }, () => {
          this.error = 'Could not load active borrowing details. Please try again or contact customer service!';
          this.loadingOpportunities = false;
        });
        if (Object.is(arr.length - 1, key)) {
          this.loadingOpportunities = false;
        }
      });
      if(value.length == 0){
        this.loadingOpportunities = false;
      }
    }, () => {
      this.error = 'Could not load active borrowing contracts. Please try again or contact customer service!';
      this.loadingOpportunities = false;
    })
  }

  /**
   * Load active and previous investments.
   */
  loadInvestmentData(): void {
    this.loadingInvestments = true;
    this.investments = [];
    this.scService.getInvestments().then(value => {
      const inv = value.filter(value1 => value1.deleted == false);
      this.investments = inv.reverse();
      this.loadingInvestments = false;
    }, () => {
      this.error = 'Could not load investments. Please try again or contact customer service!';
      this.loadingInvestments = false;
    })
  }

  /**
   * Callback when the user has invested. Reloads the data.
   * @param $event whether investment was successful
   */
  invested($event: boolean): void {
    if($event){
      this.loadOpportunitiesData();
      this.loadInvestmentData();
    }else {
      this.error = 'Could not invest money. Please try again or contact customer service!';
    }
  }

  /**
   * Callback when the user has withdrawn the investment. Reloads the investment data.
   * @param $event whether withdrawal was successful
   */
  investmentWithdrawn($event: boolean): void {
    if($event){
      window.location.reload();
    }else {
      this.error = 'Could not withdraw money. Please try again or contact customer service!';
    }
  }
}
