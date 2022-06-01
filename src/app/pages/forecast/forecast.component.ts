import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from '../../model/import/forecast';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent implements OnInit, OnDestroy {
  forecastP1: Forecast;
  forecastP2: Forecast;
  forecastP3: Forecast;
  forecastP4: Forecast;
  forecasts: Forecast[];
  period: number;

  columnsToDisplay = ['productIds', 'period0', 'period1', 'period2', 'period3'];
  rowsToDisplay = ['P1', 'P2', 'P3'];

  constructor(
    private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    // Wenn der Import vor dem Erstellen der Forecast Komponenten erfolgt, muss mit dem lokalen Browsercqache gearbeitet werden
    this.updateForecasts(this.dataSerivce.getForcasts());
    // dataSerivce.forecasts$.subscribe({ next: (f) => this.updateForecasts(f) });

    // dataSerivce.mandatoryOrders$.subscribe({
    //   next: (v) => {
    //     this.forecastP1.p1 = v.p1;
    //     this.forecastP1.p2 = v.p2;
    //     this.forecastP1.p3 = v.p3;
    //   },
    // });

    this.period = this.dataSerivce.getPeriod();
    console.log(this.period);

    // dataSerivce.period$.subscribe({
    //   next: (v) => (this.period = v),
    // });
  }

  checkIfNumberIsValid(forecast: Forecast, forecastNumber: number) {
    console.log(forecastNumber);
    if (forecastNumber < 0 || isNaN(forecastNumber) || forecastNumber == null) {
      if (forecast.p1 < 0 || isNaN(forecast.p1) || forecast.p1 == null) {
        forecast.p1 = 0;
      }
      if (forecast.p2 < 0 || isNaN(forecast.p2) || forecast.p2 == null) {
        forecast.p2 = 0;
      }
      if (forecast.p3 < 0 || isNaN(forecast.p3) || forecast.p3 == null) {
        forecast.p3 = 0;
      }
      this.triggerWarningForNonValidNumber();
    }
  }

  triggerWarningForNonValidNumber() {
    this.snackBarService.openSnackBar('forecast.error.NonValidNumber', 'Ok', 4000);
  }

  ngOnDestroy(): void {
    // this.dataSerivce.mandatoryOrders$.complete();
    // this.dataSerivce.forecasts$.complete();
    // this.dataSerivce.period$.complete();
  }

  ngOnInit(): void {
    console.log('Forecast: init', this.forecasts);
  }

  saveForecasts() {
    this.dataSerivce.setForecasts([
      this.forecastP1,
      this.forecastP2,
      this.forecastP3,
      this.forecastP4,
    ]);

    this.updateForecasts(this.dataSerivce.getForcasts());
  }

  updateForecasts(forecasts: Forecast[]): void {
    this.forecastP1 = forecasts[0]; // {} as Forecast;

    if (Object.keys(forecasts[1]).length === 0) {
      this.forecastP2 = { p1: 0, p2: 0, p3: 0 };
    } else this.forecastP2 = forecasts[1]; // {} as Forecast;

    if (Object.keys(forecasts[2]).length === 0) {
      this.forecastP3 = { p1: 0, p2: 0, p3: 0 };
    } else this.forecastP3 = forecasts[2]; // {} as Forecast;

    if (Object.keys(forecasts[3]).length === 0) {
      this.forecastP4 = { p1: 0, p2: 0, p3: 0 };
    } else this.forecastP4 = forecasts[3]; // {} as Forecast;
    this.forecasts = [
      this.forecastP1,
      this.forecastP2,
      this.forecastP3,
      this.forecastP4,
    ];
  }
}
