import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Forecast } from '../../model/import/forecast';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  forecastP1: Forecast;
  forecastP2: Forecast;
  forecastP3: Forecast;
  forecastP4: Forecast;
  period: number;
  constructor(
    private readonly dataSerivce: DataService
    ) {
      this.forecastP1 = {} as Forecast;
      this.forecastP2 = {} as Forecast;
      this.forecastP3 = {} as Forecast;
      this.forecastP4 = {} as Forecast;
      dataSerivce.forecast$.subscribe({
        next: (v) => {
          this.forecastP1.p1 = v.p1;
          this.forecastP1.p2 = v.p2;
          this.forecastP1.p3 = v.p3;
        }
      });
      dataSerivce.period$.subscribe({
        next: (v) => {
          this.period = v;
        } 
      })
      this.period = 1;
     }

  ngOnInit(): void {
  }
}
