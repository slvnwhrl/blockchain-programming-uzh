import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BorrowingConditions} from "../../../model/models";
import {SmartContractService} from "../../../service/smart-contract.service";

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.scss']
})
export class CommitComponent implements OnInit {

  @Input()
  conditions: BorrowingConditions;
  @Output()
  commited: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private scService: SmartContractService) { }

  ngOnInit(): void {
  }

  commit() {
    this.scService.commitBorrowing().then(value => {
      this.commited.emit(true);
    }, () => {
      this.commited.emit(false);
    })
  }
}
