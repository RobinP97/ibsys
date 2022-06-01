import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-directsales',
  templateUrl: './directsales.component.html',
  styleUrls: ['./directsales.component.scss'],
})
export class DirectsalesComponent implements OnInit, OnDestroy {
  directsales: Forecast;

  constructor(
    private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    this.directsales = this.dataSerivce.getDirectSales();
    // Property werden automatisch gesetzt wenn der Nuter eine Eingabe tätigt
    // this.directsales.p1 = 0;
    // this.directsales.p2 = 0;
    // this.directsales.p3 = 0;
  }

  ngOnDestroy(): void {
    this.saveDirectsales();
  }

  ngOnInit(): void {}

  onChange() {
    this.directsales.p1 = this.returnValidNumber(this.directsales.p1);
    this.directsales.p2 = this.returnValidNumber(this.directsales.p2);
    this.directsales.p3 = this.returnValidNumber(this.directsales.p3);
  }

  returnValidNumber(forecastNumber: number) {
    if (
      forecastNumber < 0 ||
      typeof forecastNumber == undefined ||
      isNaN(forecastNumber) ||
      forecastNumber == null
    ) {
      return 0;
    }
    return forecastNumber;
  }

  triggerWarningForNonValidNumber() {
    this.snackBarService.openSnackBar(
      'directSales.error.NonValidNumber',
      'Ok',
      10000
    );
  }

  saveDirectsales() {
    console.log(this.directsales);
    
    this.dataSerivce.setDirectSales(this.directsales);
  }
}
