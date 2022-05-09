import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from '../../model/import/forecast';

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
  period: number;

  constructor(private readonly dataSerivce: DataService) {
    // Wenn der Import vor dem Erstellen der Forecast Komponenten erfolgt, muss mit dem lokalen Browsercqache gearbeitet werden
    this.updateForecasts(this.dataSerivce.getForcasts());
    dataSerivce.forecasts$.subscribe({ next: (f) => this.updateForecasts(f) });

    dataSerivce.mandatoryOrders$.subscribe({
      next: (v) => {
        this.forecastP1.p1 = v.p1;
        this.forecastP1.p2 = v.p2;
        this.forecastP1.p3 = v.p3;
      },
    });

    this.period = 0;
    dataSerivce.period$.subscribe({
      next: (v) => (this.period = v),
    });
  }

  ngOnDestroy(): void {
    this.dataSerivce.mandatoryOrders$.complete();
    this.dataSerivce.forecasts$.complete();
    this.dataSerivce.period$.complete();
  }

  ngOnInit(): void {
    console.log('Forecast: init');
  }

  saveForecasts() {
    this.dataSerivce.setForecasts([
      this.forecastP1,
      this.forecastP2,
      this.forecastP3,
      this.forecastP4,
    ]);
  }

  updateForecasts(forecasts: Forecast[]): void {
    this.forecastP1 = forecasts[0]; // {} as Forecast;
    this.forecastP2 = forecasts[1]; // {} as Forecast;
    this.forecastP3 = forecasts[2]; // {} as Forecast;
    this.forecastP4 = forecasts[3]; // {} as Forecast;
  }
}
