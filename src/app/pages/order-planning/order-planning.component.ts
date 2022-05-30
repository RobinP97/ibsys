import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { OrderPlanning } from 'src/app/model/order-planning/order-planning';
import { Forecast } from 'src/app/model/import/forecast';
import { WarehouseStock } from 'src/app/model/import/warehousestock';
import { orderTypes, TypeMapping } from 'src/app/model/order-planning/orderTypeEnum';

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
  warehousestock: WarehouseStock;


  constructor(
    private readonly dataSerivce: DataService
    ) { 
      this.loadDataFromJson();
      this.forecasts = dataSerivce.getForcasts();
      this.calculateDemand();
      this.warehousestock = this.dataSerivce.getWarehouseStock();
      this.updateWareHouse();
      this.calculateNeededTillReplaced();
    }

  ngOnInit(): void {
  }


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
      part.replacementTimeAndVariance = Math.round((element.replacementTime + element.replacementTimeVariance) * 100) / 100;
      part.neededTillReplaced = 
      part.usage = element.usage;
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
      let article = this.warehousestock.article.find((art) => art.id == element.id);
      element.current_stock = article.amount;
      });
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  calculateNeededTillReplaced(): void{
    this.purchase_parts.forEach((element) => {
      let needed = 0;
      [0,1,2,3].forEach((index) => {
       // replaceTime =2.2
      if (element.replacementTimeAndVariance >= index + 1 ){
        if(element.demand.length > index)
        {
          if(isNaN(element.demand[index]))
          {

          }
          else{
            needed = element.demand[index] + needed;
          }
        }
      } 
      })
      let round = Math.floor(element.replacementTimeAndVariance);
      if(isNaN(element.demand[round]))
      {

      } 
      else{
        needed += (element.replacementTimeAndVariance - round) * element.demand[round];
      }  
      element.neededTillReplaced = Math.round(needed);
      element.differenceTillReplacedAndStock = element.neededTillReplaced - element.current_stock;
      this.calculateOrderQuantityAndType(element);
    });
  }
  calculateOrderQuantityAndType(purchase_part: OrderPlanning)
  {
    if(purchase_part.differenceTillReplacedAndStock > 0)
    {
      purchase_part.orderQuantity = purchase_part.discountAmount;
      purchase_part.orderType = orderTypes.fast;
    }
    console.log(purchase_part);
  }
}
