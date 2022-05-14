import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { OrderPlanning } from 'src/app/model/order-planning/order-planning';
import { Forecast } from 'src/app/model/import/forecast';
import { WarehouseStock } from 'src/app/model/import/warehousestock';


@Component({
  selector: 'app-order-planning',
  templateUrl: './order-planning.component.html',
  styleUrls: ['./order-planning.component.scss']
})
export class OrderPlanningComponent implements OnInit {

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
    }

  ngOnInit(): void {
  }

  loadDataFromJson(): void{
    const purchase_part = require('../../data/purchase-parts.json');
    this.purchase_parts = [];
    purchase_part.forEach((element) => {
      const part = {} as OrderPlanning;
      part.id = element.partId;
      part.category = element.category;
      part.discountAmount = element.discountAmount;
      part.replacementTime = element.replacementTime;
      part.replacementTimeVariance = element.replacementTimeVariance;
      part.usage = element.usage;
      part.current_stock = 0;
      part.demand = [];
      console.log(part);
      this.purchase_parts.push(part);
    })
  }

  calculateDemand(): void{
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

  updateWareHouse(): void{
    if(this.warehousestock !== undefined) {
      this.purchase_parts.forEach((element) => {
      let article = this.warehousestock.article.find((art) => art.id == element.id);
      element.current_stock = article.amount;
      console.log(element);
      });
    }
  }
}
