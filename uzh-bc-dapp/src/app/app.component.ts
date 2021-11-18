import { Component } from '@angular/core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uzh-bc-dapp';
  constructor(lib: FaIconLibrary, conf: NgbTooltipConfig) {
    lib.addIconPacks(far);
    lib.addIconPacks(fas);
    lib.addIconPacks(fab);
    conf.container = 'body';
  }
}
