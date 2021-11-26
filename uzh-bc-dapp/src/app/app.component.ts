import {Component, OnInit} from '@angular/core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {NgbPopoverConfig, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {SmartContractService} from "./service/smart-contract.service";
import {number} from "prop-types";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'uzh-bc-dapp';
  contractTimestamp: number;
  currentContractAddress = '';
  scControl: FormControl;
  loading = false;
  constructor(lib: FaIconLibrary, conf: NgbTooltipConfig, conf2: NgbPopoverConfig, private scService: SmartContractService) {
    lib.addIconPacks(far);
    lib.addIconPacks(fas);
    lib.addIconPacks(fab);
    conf.container = 'body';
    conf2.container = 'body';
    this.currentContractAddress = this.scService.getContractAddress();
    this.scControl = new FormControl(this.currentContractAddress);
  }

  getContractTime() {
    this.scService.getContractTime().then((value: number) => {
      this.contractTimestamp = value * 1000;
    });
  }
  setContractDate($event: MatDatepickerInputEvent<unknown, unknown | null>, popover: any): void {
    console.log($event.value.valueOf())
    const ts: number = ($event.value.valueOf() as number);
    this.loading = true;
    this.scService.setContractTime(Math.floor(ts/1000)).then(value => {
      this.getContractTime();
      popover.close();
      this.loading = false;
      window.location.reload();
    })
  }

  ngOnInit(): void {
    this.getContractTime();
  }

  setContractNow() {
    const currentDate = new Date();
    const ts = Math.floor(currentDate.getTime()/1000);
    this.loading = true;
    this.scService.setContractTime(ts).then(value => {
      this.getContractTime();
      this.loading = false;
      window.location.reload();
    })
  }

  saveSCAddress(popover: any): void {
    const res = this.scService.setContractAddress(this.scControl.value);
    if (res){
      this.currentContractAddress = this.scService.getContractAddress();
      popover.close();
      window.location.reload();
    }else {
      this.scControl.setValue('invalid');
      this.currentContractAddress = 'invalid';
    }

  }
}
