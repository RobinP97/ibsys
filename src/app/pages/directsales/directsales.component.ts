import { Component, OnDestroy, OnInit } from '@angular/core';
import { Forecast } from 'src/app/model/import/forecast';
import { DataService } from 'src/app/service/data.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-directsales',
  templateUrl: './directsales.component.html',
  styleUrls: ['./directsales.component.scss']
})
export class DirectsalesComponent implements OnInit, OnDestroy {
  directsales: Forecast;
  constructor(private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService) {
    this.directsales = {} as Forecast;
    this.directsales.p1 = 0;
    this.directsales.p2 = 0;
    this.directsales.p3 = 0;
   }
  ngOnDestroy(): void {
    this.saveDirectsales();
  }
  ngOnInit(): void {
  }

  onChange()
  {
    this.directsales.p1 = this.ReturnValidNumber(this.directsales.p1);
    this.directsales.p2 = this.ReturnValidNumber(this.directsales.p2);
    this.directsales.p3 = this.ReturnValidNumber(this.directsales.p3);
  }

  ReturnValidNumber(forecastNumber: number){
    if(forecastNumber<0 || typeof(forecastNumber) == undefined || isNaN(forecastNumber) || forecastNumber == null )
    {
      return 0;
    }
    return forecastNumber;
  }

  triggerWarningForNonValidNumber()
  {
    this.snackBarService.openSnackBar(
    'directSales.error.NonValidNumber',
    'Ok',
    10000
  );
  }

  saveDirectsales()
  {

  }

}
