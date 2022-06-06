import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { selldirect } from 'src/app/model/export/selldirect';
import { item } from 'src/app/model/export/item';

@Component({
  selector: 'app-directsales',
  templateUrl: './directsales.component.html',
  styleUrls: ['./directsales.component.scss'],
})
export class DirectsalesComponent implements OnInit, OnDestroy {
  directsales: Forecast;
  selldirect: selldirect;

  constructor(
    private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    this.directsales = this.dataSerivce.getDirectSales();
    if (Object.keys(this.directsales).length === 0)
      this.directsales = { p1: 0, p2: 0, p3: 0 };
    // this.directsales.p1 = 0;
    // this.directsales.p2 = 0;
    // this.directsales.p3 = 0;
    this.selldirect = {} as selldirect;
    this.selldirect.item = [];
    let first = {} as item;
    first.article = 1;
    first.penalty = 0;
    first.price = 0;
    first.quantity = 0;
    let second = {} as item;
    second.article = 2;
    second.penalty = 0;
    second.price = 0;
    second.quantity = 0;
    let third = {} as item;
    third.article = 3;
    third.penalty = 0;
    third.price = 0;
    third.quantity = 0;
    this.selldirect.item.push(first);
    this.selldirect.item.push(second);
    this.selldirect.item.push(third);
  }

  ngOnDestroy(): void {
    this.saveDirectsales();
    this.saveSellDirect();
  }
  saveSellDirect() {
    this.directsales.p1
    this.selldirect.item.find((item) => item.article == 1).quantity = this.directsales.p1;
    this.selldirect.item.find((item) => item.article == 2).quantity = this.directsales.p2;
    this.selldirect.item.find((item) => item.article == 3).quantity = this.directsales.p3;
    //TODO: add to dataservice
    console.log(this.selldirect);
  }

  getSellDirect(id: number)
  {
    console.log(this.selldirect);
    return this.selldirect.item.find((item) => item.article == id);
  }

  ngOnInit(): void {}

  onChange() {
    this.directsales.p1 = this.returnValidNumber(this.directsales.p1);
    this.directsales.p2 = this.returnValidNumber(this.directsales.p2);
    this.directsales.p3 = this.returnValidNumber(this.directsales.p3);
  }

  onChangePrice(id: number){
    this.getSellDirect(id).price = this.returnValidNumber(this.getSellDirect(id).price);
  }

  onChangePenalty(id: number){
    this.getSellDirect(id).penalty = this.returnValidNumber(this.getSellDirect(id).penalty);
  }

  returnValidNumber(forecastNumber: number) {
    if (
      forecastNumber < 0 ||
      typeof forecastNumber == undefined ||
      isNaN(forecastNumber) ||
      forecastNumber == null
    ) {
      this.triggerWarningForNonValidNumber();
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
    this.dataSerivce.setDirectSales(this.directsales);
    this.dataSerivce.setForecastsAndDirectSales();
  }
}
