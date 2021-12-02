import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, FormGroupDirective, NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {BorrowingRequest} from "../../../model/models";
import {ErrorStateMatcher} from "@angular/material/core";

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
  expenseIncomeErrorStateMatcher = new ExpenseIncomeErrorStateMatcher();

  /**
   * Construct the Request Component. Create request form.
   * @param fb FormBuilder to create reactive Forms
   */
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
    }, {validators: expenseIncomeValidator});
    this.ethChf = environment.currentETHCHF;
  }

  ngOnInit(): void {
  }

  /**
   * Requesting a quote and emit event to parent component
   */
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

/**
 * Validator that checks income is higher than expenses
 * @param control form group
 */
export const expenseIncomeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const income = control.get('income');
  const expenses = control.get('expenses');
  return income && expenses && parseFloat(income.value) <= parseFloat(expenses.value) ? { incomeSmallerThanExpenses: true } : null;
};

/**
 * Error state matcher for expenseIncomeValidator
 */
export class ExpenseIncomeErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.dirty);
    const hasNotSame = control.parent.hasError('incomeSmallerThanExpenses');
    return (invalidCtrl || hasNotSame);
  }
}

