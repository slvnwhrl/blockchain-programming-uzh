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
  constructor(private scService: SmartContractService) { }

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
        });
        if (Object.is(arr.length - 1, key)) {
          this.loadingOpportunities = false;
        }
      })
    })
  }

  loadInvestmentData(): void {
    this.loadingInvestments = true;
    this.investments = [];
    this.scService.getInvestments().then(value => {
      this.investments = value.filter(value1 => value1.deleted == false);
      this.loadingInvestments = false;
    })
  }

  invested(): void {
    this.loadOpportunitiesData();
    this.loadInvestmentData();
  }

  investmentWithdrawn(): void {
    this.loadInvestmentData();
  }
}
