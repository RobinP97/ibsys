import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { Item } from 'src/app/model/export/item';
import { SellDirect } from 'src/app/model/export/selldirect';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-directsales',
  templateUrl: './directsales.component.html',
  styleUrls: ['./directsales.component.scss'],
})
export class DirectsalesComponent implements OnInit, OnDestroy {
  directsales: Forecast;
  sellDirect: SellDirect;

  constructor(
    private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    // this.directsales = this.dataSerivce.getDirectSales_Old();
    // if (Object.keys(this.directsales).length === 0)
    //   this.directsales = { p1: 0, p2: 0, p3: 0 };
    // this.directsales.p1 = 0;
    // this.directsales.p2 = 0;
    // this.directsales.p3 = 0;
    this.sellDirect = this.dataSerivce.getDirectSales();
    if (this.sellDirect === undefined) this.initializeSellDirectData();
  }

  initializeSellDirectData() {
    this.sellDirect = {} as SellDirect;
    this.sellDirect.items = [];
    const first: Item = {
      article: 1,
      penalty: 0.0,
      price: 0.0,
      quantity: 0,
    };

    const second: Item = {
      article: 2,
      penalty: 0.0,
      price: 0.0,
      quantity: 0,
    };

    const third: Item = {
      article: 3,
      penalty: 0.0,
      price: 0.0,
      quantity: 0,
    };

    this.sellDirect.items.push(first);
    this.sellDirect.items.push(second);
    this.sellDirect.items.push(third);
  }

  ngOnDestroy(): void {
    this.saveDirectsales();
    // this.saveSellDirect();
  }

  // saveSellDirect() {
  //   this.directsales.p1
  //   this.sellDirect.items.find((item) => item.article == 1).quantity = this.directsales.p1;
  //   this.sellDirect.items.find((item) => item.article == 2).quantity = this.directsales.p2;
  //   this.sellDirect.items.find((item) => item.article == 3).quantity = this.directsales.p3;
  //   //TODO: add to dataservice
  //   console.log(this.sellDirect);
  // }

  // getSellDirect(id: number)
  // {
  //   console.log(this.sellDirect);
  //   return this.sellDirect.items.find((item) => item.article == id);
  // }

  ngOnInit(): void {}

  // onChange() {
  //   this.directsales.p1 = this.returnValidNumber(this.directsales.p1);
  //   this.directsales.p2 = this.returnValidNumber(this.directsales.p2);
  //   this.directsales.p3 = this.returnValidNumber(this.directsales.p3);
  // }

  // onChangePrice(id: number){
  //   this.getSellDirect(id).price = this.returnValidNumber(this.getSellDirect(id).price);
  // }

  // onChangePenalty(id: number){
  //   this.getSellDirect(id).penalty = this.returnValidNumber(this.getSellDirect(id).penalty);
  // }

  onChangeQuantity(item: Item, event: any) {
    const updatedQuantity = Number.parseFloat(event.target.value);
    const checkNum = this.returnValidNumber(updatedQuantity, item.quantity);
    item.quantity = this.returnMultipleOfTen(checkNum, item.quantity);
    event.target.value = item.quantity.toString();
  }

  onChangePrice(item: Item, event: any) {
    const updatedPrice = Number.parseFloat(event.target.value);
    item.price = this.returnValidNumber(updatedPrice, item.price);
    event.target.value = item.price.toFixed(2);
  }

  onChangePenalty(item: Item, event: any) {
    const updatedPenalty = Number.parseFloat(event.target.value);
    item.penalty = this.returnValidNumber(updatedPenalty, item.penalty);
    event.target.value = item.penalty.toFixed(2);
  }

  returnValidNumber(num2Validate: number, oldNumber: number) {
    if (
      num2Validate < 0 ||
      typeof num2Validate == undefined ||
      isNaN(num2Validate) ||
      num2Validate == null
    ) {
      this.triggerWarningForNonValidNumber();
      return oldNumber;
    }
    return num2Validate;
  }

  returnMultipleOfTen(num2Validate: number, oldNumber: number) {
    if (num2Validate % 10 !== 0) {
      this.triggerWarningForNonMultipleOfTen();
      return oldNumber;
    }
    return num2Validate;
  }

  triggerWarningForNonMultipleOfTen() {
    this.snackBarService.openSnackBar(
      'directSales.error.NonMultipleOfTen',
      'Ok',
      5000
    );
  }

  triggerWarningForNonValidNumber() {
    this.snackBarService.openSnackBar(
      'directSales.error.NonValidNumber',
      'Ok',
      5000
    );
  }

  saveDirectsales() {
    this.dataSerivce.setDirectSales(this.sellDirect);
    // this.dataSerivce.setDirectSales_Old(this.directsales);
    // this.dataSerivce.setForecastsAndDirectSales_Old();
  }
}
