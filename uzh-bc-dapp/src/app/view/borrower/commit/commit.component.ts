import {Component, Input, OnInit} from '@angular/core';
import {BorrowingConditions} from "../../../model/models";
import {SmartContractService} from "../../../service/smart-contract.service";

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.scss']
})
export class CommitComponent implements OnInit {

  @Input()
  conditions: BorrowingConditions
  constructor(private scService: SmartContractService) { }

  ngOnInit(): void {
  }

  commit() {
    this.scService.commitBorrowing().then(value => {

    })
  }
}
