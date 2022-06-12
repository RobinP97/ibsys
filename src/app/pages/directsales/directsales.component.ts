import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { Item } from 'src/app/model/export/item';
import { SellDirect } from 'src/app/model/export/selldirect';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { ValidationService } from 'src/app/service/validation.service';

@Component({
  selector: 'app-directsales',
  templateUrl: './directsales.component.html',
  styleUrls: ['./directsales.component.scss'],
})
export class DirectsalesComponent {
  // directsales: Forecast;
  sellDirect: SellDirect;

  constructor(
    private readonly dataSerivce: DataService,
    private readonly validatorService: ValidationService
  ) {
    // this.directsales = this.dataSerivce.getDirectSales_Old();
    // if (Object.keys(this.directsales).length === 0)
    //   this.directsales = { p1: 0, p2: 0, p3: 0 };
    // this.directsales.p1 = 0;
    // this.directsales.p2 = 0;
    // this.directsales.p3 = 0;
    this.sellDirect = this.dataSerivce.getDirectSales();
    if (this.sellDirect === undefined) {
      this.initializeSellDirectData();
      this.saveData();
    }
  }

  initializeSellDirectData() {
    const first: Item = this.createItem(1);
    const second: Item = this.createItem(2);
    const third: Item = this.createItem(3);

    this.sellDirect = {
      items: [first, second, third],
    };
  }

  createItem(article: number): Item {
    return {
      article,
      penalty: 0.0,
      price: 0.0,
      quantity: 0,
    };
  }

  // saveSellDirect() {
  //   this.directsales.p1
  //   this.sellDirect.items.find((item) => item.article == 1).quantity = this.directsales.p1;
  //   this.sellDirect.items.find((item) => item.article == 2).quantity = this.directsales.p2;
  //   this.sellDirect.items.find((item) => item.article == 3).quantity = this.directsales.p3;
  //   console.log(this.sellDirect);
  // }

  // getSellDirect(id: number)
  // {
  //   console.log(this.sellDirect);
  //   return this.sellDirect.items.find((item) => item.article == id);
  // }

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
    item.quantity = this.validateNumber(
      updatedQuantity,
      item.quantity,
      event.target.max,
      true
    );
    event.target.value = item.quantity.toString();
    this.saveData();
  }

  onChangePrice(item: Item, event: any) {
    const updatedPrice = Number.parseFloat(event.target.value);
    item.price = this.validateNumber(
      updatedPrice,
      item.price,
      event.target.max,
      false
    );
    event.target.value = item.price.toFixed(2);
    this.saveData();
  }

  onChangePenalty(item: Item, event: any) {
    const updatedPenalty = Number.parseFloat(event.target.value);
    item.penalty = this.validateNumber(
      updatedPenalty,
      item.penalty,
      event.target.max,
      false
    );
    event.target.value = item.penalty.toFixed(2);
    this.saveData();
  }

  formatFloat(item) {
    return item.toFixed(2);
  }

  validateNumber(
    num2Validate: number,
    oldNum: number,
    max: string,
    testMultiple: boolean
  ): number {
    console.log(this.sellDirect);

    let validatedNum = this.validatorService.returnValidNumber(
      num2Validate,
      oldNum,
      'directSales.error.NonValidNumber'
    );

    if (max?.length !== 0) {
      console.log(max);

      validatedNum = this.validatorService.returnGreaterThanMaxValue(
        validatedNum,
        oldNum,
        Number.parseFloat(max)
      );
    }

    if (testMultiple) {
      validatedNum = this.validatorService.returnMultipleOfTen(
        validatedNum,
        oldNum,
        'directSales.error.NonMultipleOfTen'
      );
    }
    return validatedNum;
  }

  // returnValidNumber(num2Validate: number, oldNumber: number) {
  //   if (
  //     num2Validate < 0 ||
  //     typeof num2Validate == undefined ||
  //     isNaN(num2Validate) ||
  //     num2Validate == null
  //   ) {
  //     this.triggerWarningForNonValidNumber();
  //     return oldNumber;
  //   }
  //   return num2Validate;
  // }

  // returnMultipleOfTen(num2Validate: number, oldNumber: number) {
  //   if (num2Validate % 10 !== 0) {
  //     this.triggerWarningForNonMultipleOfTen();
  //     return oldNumber;
  //   }
  //   return num2Validate;
  // }

  // triggerWarningForNonMultipleOfTen() {
  //   this.snackBarService.openSnackBar(
  //     'directSales.error.NonMultipleOfTen',
  //     'Ok',
  //     5000
  //   );
  // }

  // triggerWarningForNonValidNumber() {
  //   this.snackBarService.openSnackBar(
  //     'directSales.error.NonValidNumber',
  //     'Ok',
  //     5000
  //   );
  // }

  saveData() {
    this.sellDirect = { ...this.sellDirect };
    this.dataSerivce.setDirectSales(this.sellDirect);
    // this.dataSerivce.setDirectSales_Old(this.directsales);
    // this.dataSerivce.setForecastsAndDirectSales_Old();
  }
}
