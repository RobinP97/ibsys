import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  TypeMapping,
  orderTypes,
} from 'src/app/model/order-planning/orderTypeEnum';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { OrderPlanning } from 'src/app/model/order-planning/order-planning';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { ValidationService } from 'src/app/service/validation.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { WarehouseStock } from 'src/app/model/import/warehousestock';

@Component({
  selector: 'app-order-planning',
  templateUrl: './order-planning.component.html',
  styleUrls: ['./order-planning.component.scss'],
})
export class OrderPlanningComponent implements OnInit {
  public TypeMapping = TypeMapping;
  public orderTypes = Object.values(orderTypes);
  purchase_parts: OrderPlanning[];
  forecasts: Forecast[];
  period: number;
  reloaded: boolean;
  warehousestock: WarehouseStock;
  displayedColumns: Array<string> = [
    'id',
    'safeDeliveryTime',
    'discontQuantity',
    'usageInP1',
    'usageInP2',
    'usageInP3',
    'demandInPeriod1',
    'demandInPeriod2',
    'demandInPeriod3',
    'demandInPeriod4',
    'stock',
    'neededTillReplaced',
    'neededTillReplacedAfterAPeriod',
    'orderQuantity',
    'orderType',
  ];

  constructor(
    private readonly dataSerivce: DataService,
    private readonly validatorService: ValidationService
  ) {
    this.purchase_parts = this.dataSerivce.getOrderPlanning();
    // Es es die purchase_parts noch nicht gibt, dann initialisieren

    if (!this.purchase_parts) {
      this.loadDataFromJson();
      this.reloaded = false;
    } else {
      this.resetDemand(this.purchase_parts);
      this.reloaded = true;
    }
    this.forecasts = dataSerivce.getForecastsAndDirectSales();
    this.calculateDemand();
    this.warehousestock = this.dataSerivce.getWarehouseStock();
    this.updateWareHouse();
    this.period = this.dataSerivce.getPeriod();
    this.calculateNeededTillReplaced();
    this.calculateNeededTillReplacedAfterAPeriod();
    this.saveData();
  }

  ngOnInit(): void {}

  loadDataFromJson(): void {
    const purchase_part = require('../../data/purchase-parts.json');
    this.purchase_parts = [];
    purchase_part.forEach((element) => {
      const part = {} as OrderPlanning;
      part.id = element.partId;
      part.category = element.category;
      part.discountAmount = element.discountAmount;
      part.replacementTime = element.replacementTime;
      part.replacementTimeVariance = element.replacementTimeVariance;
      part.replacementTimeAndVariance =
        Math.round(
          (element.replacementTime + element.replacementTimeVariance) * 100
        ) / 100;
      part.neededTillReplaced = part.usage = element.usage;
      part.current_stock = 0;
      part.demand = [];
      part.orderQuantity = 0;
      part.orderType = orderTypes.none;
      this.purchase_parts.push(part);
    });
  }

  calculateDemand(): void {
    this.purchase_parts.forEach((element) => {
      this.forecasts.forEach((forecast) => {
        let demand = 0;
        demand += forecast.p1 * element.usage[0];
        demand += forecast.p2 * element.usage[1];
        demand += forecast.p3 * element.usage[2];
        element.demand.push(demand);
      });
    });
  }

  updateWareHouse(): void {
    if (this.warehousestock !== undefined) {
      this.purchase_parts.forEach((element) => {
        let article = this.warehousestock.article.find(
          (art) => art.id == element.id
        );
        element.current_stock = article.amount;
      });
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  calculateNeededTillReplaced(): void {
    this.purchase_parts.forEach((element) => {
      let needed = 0;
      [0, 1, 2, 3].forEach((index) => {
        // replaceTime =2.2
        if (element.replacementTimeAndVariance >= index + 1) {
          if (element.demand.length > index) {
            if (isNaN(element.demand[index])) {
            } else {
              needed = element.demand[index] + needed;
            }
          }
        }
      });
      let round = Math.floor(element.replacementTimeAndVariance);
      if (isNaN(element.demand[round])) {
      } else {
        needed +=
          (element.replacementTimeAndVariance - round) * element.demand[round];
      }
      element.neededTillReplaced = Math.round(needed);
      element.differenceTillReplacedAndStock =
        element.neededTillReplaced - element.current_stock;
      this.calculateOrderQuantityAndType(element);
    });
  }

  calculateNeededTillReplacedAfterAPeriod(): void {
    this.purchase_parts.forEach((element) => {
      let needed = 0;
      [0, 1, 2, 3].forEach((index) => {
        // replaceTime =2.2
        if (element.replacementTimeAndVariance + 1 >= index + 1) {
          if (element.demand.length > index) {
            if (isNaN(element.demand[index])) {
            } else {
              needed = element.demand[index] + needed;
            }
          }
        }
      });
      let round = Math.floor(element.replacementTimeAndVariance + 1);
      if (isNaN(element.demand[round])) {
      } else {
        needed +=
          (element.replacementTimeAndVariance + 1 - round) *
          element.demand[round];
      }
      element.neededTillReplacedAfterAPeriod = Math.round(needed);
      element.differenceTillReplacedAndStockAfterAPeriod =
        element.neededTillReplacedAfterAPeriod - element.current_stock;
      this.calculateOrderQuantityAndTypeNormal(element);
    });
  }

  calculateOrderQuantityAndType(purchase_part: OrderPlanning) {
    if (purchase_part.differenceTillReplacedAndStock > 0 && !this.reloaded) {
      purchase_part.orderQuantity = purchase_part.discountAmount;
      purchase_part.orderType = orderTypes.fast;
    }
    console.log(purchase_part);
  }

  calculateOrderQuantityAndTypeNormal(purchase_part: OrderPlanning) {
    if (
      purchase_part.differenceTillReplacedAndStockAfterAPeriod > 0 &&
      purchase_part.orderType !== orderTypes.fast && !this.reloaded
    ) {
      purchase_part.orderQuantity = purchase_part.discountAmount;
      purchase_part.orderType = orderTypes.normal;
    }
    console.log(purchase_part);
  }

  saveData() {
    this.dataSerivce.setOrderPlanning(this.purchase_parts);
  }

  checkOrderQuantity(purchase_part: OrderPlanning, event: any) {
    const updatedQuantity = Number.parseInt(event.target.value);
    // Werte validieren
    purchase_part.orderQuantity = this.validatorService.returnValidNumber(
      updatedQuantity,
      purchase_part.orderQuantity,
      'orderPlanning.error.NonValidOrderNumber'
    );
    // Template aktualisieren
    event.target.value = purchase_part.orderQuantity.toString();

    // purchase_part.orderQuantity = this.validateOrderNumber(
    //   purchase_part.orderQuantity
    // );
    if (purchase_part.orderQuantity === 0) {
      purchase_part.orderType = orderTypes.none;
    } else if (purchase_part.orderType === orderTypes.none) {
      purchase_part.orderType = orderTypes.normal;
    }
  }

  // validateOrderNumber(num: number) {
  //   if (
  //     num == null ||
  //     num == undefined ||
  //     num < 0 ||
  //     isNaN(num) ||
  //     num == NaN
  //   ) {
  //     this.snackBarService.openSnackBar(
  //       'orderPlanning.error.NonValidOrderNumber',
  //       'Ok',
  //       5000
  //     );
  //     return 0;
  //   }
  //   return num;
  // }

  checkOrderType(purchase_part: OrderPlanning) {
    if (purchase_part.orderType == orderTypes.none) {
      purchase_part.orderQuantity = 0;
    }
  }

  resetDemand(purchase_parts: OrderPlanning[]) {
    purchase_parts.forEach((element) => {
      element.demand = [];
    });
  }

  getDemandTillReplaceText(element: OrderPlanning) {
    let needed = '';
    [0, 1, 2, 3].forEach((index) => {
      // replaceTime =2.2
      if (element.replacementTimeAndVariance >= index + 1) {
        if (element.demand.length > index) {
          if (isNaN(element.demand[index])) {
          } else {
            needed += element.demand[index];
            needed += ' + ';
          }
        }
      }
    });
    let round = Math.floor(element.replacementTimeAndVariance);
    if (isNaN(element.demand[round])) {
    } else {
      needed +=
        Number((element.replacementTimeAndVariance - round).toFixed(2)) +
        ' * ' +
        element.demand[round];
    }
    needed += ' = ' + element.neededTillReplaced;
    return needed;
  }

  getDemandTillReplacedAfterAPeriodText(element: OrderPlanning) {
    let needed = '';
    [0, 1, 2, 3].forEach((index) => {
      // replaceTime =2.2
      if (element.replacementTimeAndVariance + 1 >= index + 1) {
        if (element.demand.length > index) {
          if (isNaN(element.demand[index])) {
          } else {
            needed += element.demand[index];
            needed += ' + ';
          }
        }
      }
    });
    let round = Math.floor(element.replacementTimeAndVariance + 1);
    if (isNaN(element.demand[round])) {
    } else {
      needed +=
        Number((element.replacementTimeAndVariance + 1 - round).toFixed(2)) +
        ' * ' +
        element.demand[round];
    }
    needed += ' = ' + element.neededTillReplacedAfterAPeriod;
    return needed;
    /*
      
    this.purchase_parts.forEach((element) => {
      let needed = 0;
      [0, 1, 2, 3].forEach((index) => {
        // replaceTime =2.2
        if (element.replacementTimeAndVariance+1 >= index + 1) {
          if (element.demand.length > index) {
            if (isNaN(element.demand[index])) {
            } else {
              needed = element.demand[index] + needed;
            }
          }
        }
      });
      let round = Math.floor(element.replacementTimeAndVariance+1);
      if (isNaN(element.demand[round])) {
      } else {
        needed +=
          (element.replacementTimeAndVariance+1 - round) * element.demand[round];
      }
      element.neededTillReplacedAfterAPeriod = Math.round(needed);
      element.differenceTillReplacedAndStockAfterAPeriod =
        element.neededTillReplacedAfterAPeriod - element.current_stock;
      this.calculateOrderQuantityAndTypeNormal(element);
    });*/
  }
}
