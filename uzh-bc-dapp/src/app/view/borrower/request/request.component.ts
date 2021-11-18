import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {BorrowingRequest} from "../../../model/models";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  requestForm: FormGroup;
  ethChf: number;
  @Output()
  quoteRequested: EventEmitter<BorrowingRequest> = new EventEmitter<BorrowingRequest>();
  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
        amount: [0.1, Validators.required],
        duration: [12, Validators.required],
        income: ['', Validators.required],
        expenses: ['', Validators.required],
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
    });
    this.ethChf = environment.currentETHCHF;
  }

  ngOnInit(): void {

  }

  requestQuote(): void {
    const request = new BorrowingRequest(
      this.requestForm.get('amount')?.value * 1e18,
      this.requestForm.get('duration')?.value,
      this.requestForm.get('income')?.value,
      this.requestForm.get('expenses')?.value
    );
    this.quoteRequested.emit(request);
  }

}
