import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { BorrowerComponent } from './view/borrower/borrower.component';
import { InvestorComponent } from './view/investor/investor.component';
import { HomeComponent } from './view/home/home.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { RequestComponent } from './view/borrower/request/request.component';
import {NgxMaskModule} from "ngx-mask";
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BorrowingDisplayerComponent } from './view/investor/borrowing-displayer/borrowing-displayer.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { InvestmentDisplayerComponent } from './view/investor/investment-displayer/investment-displayer.component';
import { CommitComponent } from './view/borrower/commit/commit.component';
import { PaybackComponent } from './view/borrower/payback/payback.component';

@NgModule({
  declarations: [
    AppComponent,
    BorrowerComponent,
    InvestorComponent,
    HomeComponent,
    RequestComponent,
    BorrowingDisplayerComponent,
    InvestmentDisplayerComponent,
    CommitComponent,
    PaybackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(),
    MatSliderModule,
    MatFormFieldModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
