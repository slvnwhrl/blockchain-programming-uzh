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
  committed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Commit to borrowing. Emit event to parent
   */
  commit() {
    this.committed.emit(true);
  }
}
