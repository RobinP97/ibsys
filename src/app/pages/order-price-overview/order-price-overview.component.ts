import { Component, OnInit } from '@angular/core';
import { OrderPlanning } from 'src/app/model/order-planning/order-planning';
import { orderTypes } from 'src/app/model/order-planning/orderTypeEnum';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-order-price-overview',
  templateUrl: './order-price-overview.component.html',
  styleUrls: ['./order-price-overview.component.scss']
})
export class OrderPriceOverviewComponent implements OnInit {
  orders: OrderPlanning[];
  orderData;

  constructor(
    private readonly dataSerivce: DataService) {
      let allOrders = dataSerivce.getOrderPlanning();
      this.orders = allOrders.filter(order => order.orderQuantity>0);
      this.orderData = require('../../data/purchase-parts.json');
     }

  ngOnInit(): void {
  }

  findOrderDataById(id: number)
  {
    return this.orderData.find((data) => data?.partId == id)
  }

  findOrderById(id: number)
  {
    return this.orders.find((order) => order?.id == id)
  }

  getOrderCost(id: number)
  {
    let ordercost = this.findOrderDataById(id)?.orderCosts;
    let order = this.findOrderById(id);
    if(order.orderType == orderTypes.fast)
    {
      ordercost = ordercost * 10;
    }
    return ordercost;
  }

  getTotalOrderCost(id: number)
  {
    let costs = 0;
    let order = this.findOrderById(id);
    costs += this.getOrderCostForPieces(id);
    let factor = 1;
    if(order.orderType == orderTypes.fast)
    {
      factor = 10;
    }
    costs += this.findOrderDataById(order.id).orderCosts * factor;
    return costs;
  }

  getOrderCostPerPiece(id: number)
  {
    let costs = 0;
    let order = this.findOrderById(id);
    if(order.orderQuantity >= this.findOrderDataById(id).discountAmount)
    {
      costs += (this.findOrderDataById(order.id).startPrice)*0.9;
    }
    else
    {
      costs += this.findOrderDataById(order.id).startPrice;
    }
    return Math.round(costs*1000)/1000;
  }

  getOrderCostForPieces(id: number)
  {
    let price = this.getOrderCostPerPiece(id);
    let quantity = this.findOrderById(id).orderQuantity;
    return Math.round((price * quantity)*100)/100;
  }

  getSumOfTotalOrderCost()
  {
    let costs = 0;
    this.orders.forEach((order) => {
      costs += this.getTotalOrderCost(order.id);
    });
    return costs;
  }

}
