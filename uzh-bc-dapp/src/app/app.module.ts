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

@NgModule({
  declarations: [
    AppComponent,
    BorrowerComponent,
    InvestorComponent,
    HomeComponent,
    RequestComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }