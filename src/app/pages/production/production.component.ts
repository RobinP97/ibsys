import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { OrderInWork } from 'src/app/model/import/orderinwork';
import { Production } from 'src/app/model/production/production';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { WarehouseStock } from 'src/app/model/import/warehousestock';
import { WorkplaceWaitingListWorkstation } from 'src/app/model/import/workplaceWaitingListWorkstations';
import { processingChain } from 'src/app/model/production/processing_chain';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
})
export class ProductionComponent {
  // Alle Bestellungen der Periode
  inhouse_parts: Production[];
  forecasts: Forecast[];
  warehousestock: WarehouseStock;
  ordersinwork: OrderInWork[];
  waitinglistWorkstations: WorkplaceWaitingListWorkstation[];

  constructor(
    private readonly dataService: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    // dataSerivce.forecasts$.subscribe({
    //   next: (v) => {
    //     this.forecasts = v;
    //     //@robin: sollte, das hier nicht updateAfterChange sein?
    //     this.updateArrayAfterImport();
    //   },
    // });
    // Vielleicht ist es einfacher am Anfang via dataService.get... sich die Daten zu holen, damit zu arbeiten und am Ende, wenn die Komponente verlassen wird alle mit
    // dataService.set... abzuspeichern
    // dataSerivce.ordersInWork$.subscribe({
    //   next: (v) => {
    //     this.ordersinwork = v;
    //     this.updateArrayAfterImport();
    //   },
    // });
    // dataSerivce.warehouseStock$.subscribe({
    //   next: (v) => {
    //     this.warehousestock = v;
    //     this.updateArrayAfterImport();
    //   },
    // });
    // dataSerivce.waitinglistworkstations$.subscribe({
    //   next: (v) => {
    //     this.waitinglistWorkstations = v;
    //     this.updateArrayAfterImport();
    //   },
    // });
    // Entweder wurde die Eigenfertigung schon einmal geplant und unter dem Schlüssel "production" abgespeichert
    this.inhouse_parts = dataService.getProductionOrders();
    // oder noch nicht, sodass man initial eine Zusammenstellung aus den importierten Daten und inhouse-parts.json erstellen muss
    //if (!this.inhouse_parts) { inhouse_parts müssen geupdatet werden wenn vor und zurück gesprungen wird!
      this.initializeInhouseParts(dataService);

      this.waitinglistWorkstations =
        this.dataService.getWaitinglistWorkstations();
      this.forecasts = this.dataService.getForecastsAndDirectSales();
      this.warehousestock = this.dataService.getWarehouseStock();
      this.ordersinwork = this.dataService.getOrdersInWork();

      this.updateArrayAfterImport();
    //}
  }

  setWaitingListWorkstations() {
    // if (this.waitinglistWorkstations !== undefined) {
    this.waitinglistWorkstations?.forEach((waitinglistWorkStation) => {
      // if (waitinglistWorkStation.waitinglist !== undefined) {
      waitinglistWorkStation.waitinglist?.forEach((element) => {
        this.inhouse_parts.find((x) => x.id == element.item).in_queue =
          element.amount;
      });
      // }
    });
    // }
  }

  setOrderInWork() {
    // if (this.ordersinwork !== undefined) {
    this.ordersinwork?.forEach((element) => {
      this.inhouse_parts.find((x) => x.id == element.item).in_process =
        element.amount;
    });
    // }
  }

  setForecastUse(): void {
    if (this.forecasts[0] !== undefined) {
      const first = this.inhouse_parts.find((x) => x.id == 1);
      first.binding_orders = this.forecasts[0].p1;
      first.planned_stock = first.binding_orders;
      const second = this.inhouse_parts.find((x) => x.id == 2);
      second.binding_orders = this.forecasts[0].p2;
      second.planned_stock = second.binding_orders;
      const third = this.inhouse_parts.find((x) => x.id == 3);
      third.binding_orders = this.forecasts[0].p3;
      third.planned_stock = third.binding_orders;
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // inhouse_parts initial mit Werten aus inhouse-parts.json befüllen
  initializeInhouseParts(dataSerivce: DataService): void {
    const inhouse_part = require('../../data/inhouse-parts.json');
    this.inhouse_parts = [];
    inhouse_part.forEach((element) => {
      const part = {} as Production;
      part.id = parseInt(element.partId);
      part.category = element.category;
      part.binding_orders = 0;
      part.current_stock = 0;
      part.planned_production = 0;
      part.planned_stock = 0;
      part.in_queue = 0;
      part.predecessor_waiting_list = 0;
      part.in_process = 0;
      part.elements = element.elements;
      part.processing_chain = [];
      element.processingChain.forEach((chainPart) => {

        let chain = {} as processingChain;
        chain.setUpTime = chainPart.setUpTime;
        chain.productionTime = chainPart.productionTime;
        chain.workstationId = chainPart.workstationId;
        part.processing_chain.push(chain);
                
      }
      );
      this.inhouse_parts.push(part);
    });
    console.log(this.inhouse_parts);
  }

  updateArrayAfterImport() {
    this.setWaitingListWorkstations();
    this.setForecastUse(); // Spalten Verbindliche Aufträge und Geplanter Lagerbestand am Ende der Period
    this.setOrderInWork(); // Spalte Aufträge in Bearbeitung
    this.updateWareHouse(); // Spalte Aktueller Lagerbestand
    this.resetBindingOrders(); // Spalte verbindliche Aufträge ab id=4

    this.onChange(
      this.inhouse_parts.find((x) => x.id == 1),
      undefined,
      true
    );
    this.onChange(
      this.inhouse_parts.find((x) => x.id == 2),
      undefined,
      true
    );
    this.onChange(
      this.inhouse_parts.find((x) => x.id == 3),
      undefined,
      true
    );
  }

  updateAfterChange(inhouse_part) {
    // TODO: Bei Ändeurngen in der Spalte "Verbindliche Aufträge" klappt das aktualisieren für alle E-Produkte noch nicht. Grund ist der reset der binding orders
    // Lsg: Vielleicht einfache keine Eingabemöglichkeit für die verbindlichen Aufträge
    // TODO: @robin welche spalten sol der User überhaupt editieren können. Alles was der USer ändern kann müssen wir abspeichern und einlesen...
    this.resetBindingOrders();
    this.updateChain(this.inhouse_parts.find((x) => x.id == 1));
    this.updateChain(this.inhouse_parts.find((x) => x.id == 2));
    this.updateChain(this.inhouse_parts.find((x) => x.id == 3));
    this.dataService.setProductionOrders(this.inhouse_parts);
  }

  checkPartIsNotNegative(part: Production) {
    if (
      part.in_process < 0 ||
      isNaN(part.in_process) ||
      part.in_process == null
    ) {
      this.warnUserNegativeNumber(part.in_process, 'in_process');
      part.in_process = 0;
    }
    if (part.in_queue < 0 || isNaN(part.in_queue) || part.in_queue == null) {
      this.warnUserNegativeNumber(part.in_queue, 'in_queue');
      part.in_queue = 0;
    }
    if (
      part.planned_stock < 0 ||
      isNaN(part.planned_stock) ||
      part.planned_stock == null
    ) {
      this.warnUserNegativeNumber(part.planned_stock, 'planned_stock');
      part.planned_stock = 0;
    }
    if (
      part.current_stock < 0 ||
      isNaN(part.current_stock) ||
      part.current_stock == null
    ) {
      this.warnUserNegativeNumber(part.current_stock, 'current_stock');
      part.current_stock = 0;
    }
  }

  warnUserNegativeNumber(num: number, Attribute: string) {
    this.snackBarService.openSnackBar(
      'production.error.' + Attribute,
      'Ok',
      10000
    );
  }

  updateChain(
    part: Production,
    binding_orders?: number,
    predecessor_waiting_list?: number
  ) {
    let planned = 0;
    if (typeof binding_orders !== 'undefined' && binding_orders > 0) {
      part.binding_orders += binding_orders;
    }
    if (typeof predecessor_waiting_list !== 'undefined') {
      part.predecessor_waiting_list = predecessor_waiting_list;
    }
    this.checkPartIsNotNegative(part);
    planned =
      part.binding_orders +
      part.predecessor_waiting_list +
      part.planned_stock -
      part.current_stock -
      part.in_queue -
      part.in_process;
    console.log(part.id + ':');
    console.log(
      planned +
        ' = ' +
        part.binding_orders +
        ' + ' +
        part.predecessor_waiting_list +
        ' + ' +
        part.planned_stock +
        ' - ' +
        part.current_stock +
        ' - ' +
        part.in_queue +
        ' - ' +
        part.in_process
    );
    if (planned < 0) {
      planned = 0;
    }
    part.planned_production = planned;
    if (typeof part.elements !== 'undefined' && part.elements.length > 0) {
      part.elements.forEach((element) => {
        this.updateChain(
          this.inhouse_parts.find((x) => x.id == element),
          planned,
          part.in_queue
        );
      });
    }
  }

  updateWareHouse(): void {
    if (this.warehousestock !== undefined) {
      this.inhouse_parts.forEach((element) => {
        let article = this.warehousestock.article.find(
          (x) => x.id == element.id
        );
        element.current_stock = article.amount;
      });
    }
  }

  resetBindingOrders() {
    this.inhouse_parts.forEach((element) => {
      if (element.id > 3) {
        element.binding_orders = 0;
      }
    });
  }

  onChange(
    part: Production,
    binding_orders?: number,
    imported?: boolean,
    predecessor_waiting_list?: number
  ): void {
    let planned = 0;
    if (imported) {
      part.planned_stock = part.current_stock;
    }
    if (typeof predecessor_waiting_list !== 'undefined') {
      part.predecessor_waiting_list = predecessor_waiting_list;
    }
    if (typeof binding_orders !== 'undefined') {
      if (binding_orders < 0) {
        binding_orders = 0;
      }
      part.binding_orders += binding_orders;
    }
    if (part.in_queue > 0) {
      // TODO: Im ersten Durchlauf ist planned noch 0
      console.log(part.id + ':');
      console.log(
        planned +
          ' = ' +
          part.binding_orders +
          ' + ' +
          part.predecessor_waiting_list +
          '+' +
          part.planned_stock +
          ' - ' +
          part.current_stock +
          ' - ' +
          part.in_queue +
          ' - ' +
          part.in_process
      );
    }
    planned =
      part.binding_orders +
      part.predecessor_waiting_list +
      part.planned_stock -
      part.current_stock -
      part.in_queue -
      part.in_process;
    if (planned < 0) {
      planned = 0;
    }

    part.planned_production = planned;

    if (typeof part.elements !== 'undefined' && part.elements.length > 0) {
      part.elements.forEach((element) => {
        console.log(part.in_queue);
        this.onChange(
          this.inhouse_parts.find((x) => x.id == element),
          part.planned_production,
          imported,
          part.in_queue
        );
      });
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log(this.inhouse_parts);

    if (this.inhouse_parts) {
      this.dataService.setProductionOrders(this.inhouse_parts);
    }
  }
}
