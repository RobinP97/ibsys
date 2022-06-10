import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { OrderPlanning } from 'src/app/model/order-planning/order-planning';
import { Production } from 'src/app/model/production/production';
import { SellDirect } from 'src/app/model/export/selldirect';
import { Workstation } from 'src/app/model/capacity/workstation';
import { orderTypes } from 'src/app/model/order-planning/orderTypeEnum';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
  mandatoryOrders: Forecast;
  directSales: SellDirect;
  orders: OrderPlanning[];
  productionOrders: Production[];
  workstations: Workstation[];

  constructor(private readonly dataService: DataService) {
    this.mandatoryOrders = dataService.getMandatoryOrders();
    this.directSales = dataService.getDirectSales();
    this.productionOrders = dataService.getProductionOrdersWithResolvedSplits();
    this.orders = this.dataService.getOrderPlanning();
    // [
    //   {
    //     id: 1,
    //     category: 'K',
    //     discountAmount: 200,
    //     replacementTime: 20,
    //     replacementTimeVariance: 2,
    //     replacementTimeAndVariance: 2,
    //     neededTillReplaced: 2,
    //     usage: [],
    //     demand: [],
    //     current_stock: 2222,
    //     differenceTillReplacedAndStock: 2,
    //     orderQuantity: 400,
    //     orderType: orderTypes.fast,
    //   },
    // ];
    this.workstations = this.dataService.getWorkStations();
    // [
    //   {
    //     id: '1',
    //     productionTime: [],
    //     totalSetUpTime: 10,
    //     totalProductionTime: 10,
    //     totalTime: 80,
    //     capacityNeedDeficitPriorPeriod: 10,
    //     setUpTimeDeficitPriorPeriod: 10,
    //     shifts: 10,
    //     overTime: 10,
    //   },
    // ];
  }

  ngOnInit(): void {
    this.orders = this.orders?.filter(
      (order) => order.orderType !== orderTypes.none
    );
  }

  getObjectKeys(object: any) {
    return Object.keys(this.mandatoryOrders);
  }
  getMandatoryOrdersDataSource() {
    return Object.keys(this.mandatoryOrders);
  }

  exportData() {
    let xml = '';
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += header;
    xml += '<input>\n';
    xml += '\t<qualitycontrol type="no" losequantity="0" delay="0"/>\n';

    // Produktionsplan
    xml += '\t<sellwish>\n';
    for (const i of [1, 2, 3]) {
      xml += `\t\t<item article="${i}" quantity="${
        this.mandatoryOrders['p' + i] ?? 0
      }"/>\n`;
    }
    xml += '\t</sellwish>\n';

    // Direktverkauf
    xml += '\t<selldirect>\n';
    // TODO
    for (let item of this.directSales.items) {
      xml += `\t\t<item article="${item.article}" quantity="${
        item.quantity ?? '0'
      }" price="${item.price?.toFixed(2) ?? '0.00'}" penalty="${
        item.penalty?.toFixed(2) ?? '0.00'
      }"/>\n`;
    }
    xml += '\t</selldirect>\n';

    // Bestellplanung
    // Mapping orderType auf 4 = fast und 5 = normal
    xml += '\t<orderlist>\n';
    for (const order of this.orders) {
      xml += `\t\t<order article="${order.id}" quantity="${
        order.orderQuantity
      }" modus="${order.orderType === orderTypes.fast ? 4 : 5}"/>\n`;
    }
    xml += '\t</orderlist>';

    // Produktionsplan
    xml += '\t<productionlist>\n';
    for (const productionOrder of this.productionOrders) {
      xml += `\t\t<production article="${productionOrder.id}" quantity="${productionOrder.planned_production}"/>\n`;
    }
    xml += '\t</productionlist>\n';

    // Kapazitätsplan
    xml += '\t<workingtimelist>\n';
    for (const workstation of this.workstations) {
      xml += `\t\t<workingtime station="${workstation.id}" shift="${workstation.shifts}" overtime="${workstation.overTime}"/>\n`;
    }
    xml += '\t</workingtimelist>\n';

    xml += '</input>';

    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    saveAs(blob, 'output' + '.xml');
  }
}
