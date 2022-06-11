import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from '../../model/import/forecast';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  forecastP1: Forecast;
  forecastP2: Forecast;
  forecastP3: Forecast;
  forecastP4: Forecast;

  period: number;

  rowsToDisplay = ['p1', 'p2', 'p3'];

  constructor(
    private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    const forecasts: Forecast[] = this.dataSerivce.getForcasts();

    this.forecastP1 = this.initializeForecast(forecasts[0]);
    this.forecastP2 = this.initializeForecast(forecasts[1]);
    this.forecastP3 = this.initializeForecast(forecasts[2]);
    this.forecastP4 = this.initializeForecast(forecasts[3]);

    this.period = this.dataSerivce.getPeriod();
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
    this.snackBarService.openSnackBar(
      'forecast.error.NonValidNumber',
      'Ok',
      4000
    );
  }

  initializeForecast(forecast: Forecast): Forecast {
    return {
      p1: forecast.p1 ?? 0,
      p2: forecast.p2 ?? 0,
      p3: forecast.p3 ?? 0,
    };
  }

  saveData() {
    this.dataSerivce.setForecasts([
      this.forecastP1,
      this.forecastP2,
      this.forecastP3,
      this.forecastP4,
    ]);
  }
}
