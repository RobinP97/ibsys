import { Component, OnInit } from '@angular/core';
import { Forecast } from 'src/app/model/import/forecast';
import { DataService } from 'src/app/service/data.service';
import { Production } from 'src/app/model/production/production';
import { WarehouseStock } from 'src/app/model/import/warehousestock';
import { OrderInWork } from 'src/app/model/import/orderinwork';
import { WorkplaceWaitingListWorkstation } from 'src/app/model/import/workplaceWaitingListWorkstations';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit {
  inhouse_parts: Production[];
  forecasts: Forecast[];
  warehousestock: WarehouseStock;
  ordersinwork: OrderInWork[];
  count: number;
  waitinglistWorkstations: WorkplaceWaitingListWorkstation[];
  

  constructor(private readonly dataSerivce: DataService) { 
    this.count = 0;  
    dataSerivce.forecasts$.subscribe({
    next: (v) => {
      this.forecasts = v;
      this.count++;
      this.updateArrayAfterImport();
    },
  });
  dataSerivce.ordersInWork$.subscribe({
    next: (v) => {
      this.ordersinwork = v;
      this.count++;
      this.updateArrayAfterImport();
    },
  });
  dataSerivce.warehouseStock$.subscribe({
    next: (v) => {
      this.warehousestock = v;
      this.count++;
      this.updateArrayAfterImport();
    },
  });
  /*dataSerivce.waitinglistworkstations$.subscribe({
    next: (v) => {
      this.waitinglistWorkstations = v;
      this.count++;
      this.updateArrayAfterImport();
    },
  });*/
  this.fillArray(dataSerivce);
  }

  /*setWaitingListWorkstations(){
    this.waitinglistWorkstations.forEach( waitinglistWorkStation => {
      console.log("test:")
      console.log(waitinglistWorkStation);
      waitinglistWorkStation.waitinglist.forEach(element => {

      this.inhouse_parts.find(x => x.id == element.item).in_queue = element.amount;
      })
    })
  }*/

  setOrderInWork(){
    this.ordersinwork.forEach(element => {
      this.inhouse_parts.find(x => x.id == element.item).in_process = element.amount;
    })
  }

  setForecastUse(): void {
    var first = this.inhouse_parts.find(x => x.id == 1);
    first.binding_orders = this.forecasts[0].p1;
    first.planned_stock = first.binding_orders;
    var second = this.inhouse_parts.find(x => x.id == 2);
    second.binding_orders = this.forecasts[0].p2;
    second.planned_stock = second.binding_orders;
    var third = this.inhouse_parts.find(x => x.id == 3);
    third.binding_orders = this.forecasts[0].p3;
    third.planned_stock = third.binding_orders;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  fillArray(dataSerivce: DataService): void {
    let inhouse_part = require("../../data/inhouse-parts.json");
    this.inhouse_parts = [];
    inhouse_part.forEach(element => {
      let part = {} as Production;
      part.id = element.partId;
      part.category = element.category;
      part.binding_orders = 0;
      part.current_stock = 0;
      part.planned_production = 0;
      part.planned_stock = 0;
      part.in_queue = 0;
      part.in_process = 0;
      part.elements = element.elements;
      this.inhouse_parts.push(part);
    });
  }

  updateArrayAfterImport()
  {
    if(this.count == 3)
    {
      this.setForecastUse();
      this.setOrderInWork();
      this.updateWareHouse();
      //this.setWaitingListWorkstations();
      this.resetBindingOrders();
      this.onChange(this.inhouse_parts.find(x => x.id == 1),undefined, true);
      this.onChange(this.inhouse_parts.find(x => x.id == 2),undefined, true);
      this.onChange(this.inhouse_parts.find(x => x.id == 3),undefined, true);
    }
  }

  updateAfterChange()
  {
    this.resetBindingOrders();
    this.UpdateChain(this.inhouse_parts.find(x => x.id == 1));
    this.UpdateChain(this.inhouse_parts.find(x => x.id == 2));
    this.UpdateChain(this.inhouse_parts.find(x => x.id == 3));
  }
  
  UpdateChain(part: Production, binding_orders?: number)
  {
    let planned = 0;


    if(typeof binding_orders !== 'undefined' && binding_orders > 0)
    {
      part.binding_orders += binding_orders;
    }
    planned = part.binding_orders + part.planned_stock - part.current_stock - part.in_queue - part.in_process;   
    if(planned<0)
    {
      planned = 0;
    }
    part.planned_production = planned;
    if(typeof part.elements !== 'undefined' && part.elements.length > 0)
    {
      part.elements.forEach(element => {
        this.UpdateChain(this.inhouse_parts.find(x => x.id == element), planned);
      })
    }
  }

  updateWareHouse(): void {
    this.inhouse_parts.forEach(element => {
      let article = this.warehousestock.article.find(x => x.id == element.id);
      element.current_stock = article.amount;
    });
  }

  resetBindingOrders(){
    this.inhouse_parts.forEach(element => {
      if(element.id > 3)
      {
        element.binding_orders = 0;
      }
    });
  }

  onChange(part: Production, binding_orders?: number, imported?: boolean): void{

    let planned = 0;
    if(imported)
    {
      part.planned_stock = part.current_stock;
    }

    if(typeof binding_orders !== 'undefined')
    {
      if(binding_orders < 0)
      {
        binding_orders = 0;
      }
      part.binding_orders += binding_orders;
    }
    planned = part.binding_orders + part.planned_stock - part.current_stock - part.in_queue - part.in_process;
    if(planned<0)
    {
      planned = 0;
    }

    part.planned_production = planned;

    if(typeof part.elements !== 'undefined' && part.elements.length > 0)
    {
      part.elements.forEach(element => {
        this.onChange(this.inhouse_parts.find(x => x.id == element),part.planned_production,imported);
      });
    }
  }

  ngOnInit(): void {
  }

}
