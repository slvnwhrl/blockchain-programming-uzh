import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BorrowerComponent} from "./view/borrower/borrower.component";
import {InvestorComponent} from "./view/investor/investor.component";
import {HomeComponent} from "./view/home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'borrow',
    component: BorrowerComponent
  },
  {
    path: 'invest',
    component: InvestorComponent
  },
  { path: '**',   redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
