import { Component, OnInit } from '@angular/core';
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
  constructor(private scService: SmartContractService) {
    this.scService.borrowingFundingChanged$.subscribe(value => {
      if (value) {
        this.loadOpportunitiesData();
      }
    });
    this.scService.investmentPaybackChanged$.subscribe(value => {
      if (value) {
        this.loadInvestmentData();
      }
    });
    this.scService.moneyWithdrawn$.subscribe(value => {
      if (value) {
        this.loadInvestmentData();
      }
    });
    this.scService.investmentWithdrawn$.subscribe(value => {
      if (value) {
        this.loadInvestmentData();
      }
    });
  }

  ngOnInit(): void {
    this.loadOpportunitiesData();
    this.loadInvestmentData();
  }

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

  loadInvestmentData(): void {
    this.loadingInvestments = true;
    this.investments = [];
    this.scService.getInvestments().then(value => {
      this.investments = value.filter(value1 => value1.deleted == false);
      this.loadingInvestments = false;
    }, () => {
      this.error = 'Could not load investments. Please try again or contact customer service!';
      this.loadingInvestments = false;
    })
  }

  invested($event: boolean): void {
    if($event){
      this.loadOpportunitiesData();
      this.loadInvestmentData();
    }else {
      this.error = 'Could not invest money. Please try again or contact customer service!';
    }
  }

  investmentWithdrawn($event: boolean): void {
    if($event){
      this.loadInvestmentData();
    }else {
      this.error = 'Could not withdraw money. Please try again or contact customer service!';
    }
  }
}
