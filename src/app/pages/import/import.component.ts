import { Component, OnInit } from '@angular/core';

import { IoService } from 'src/app/service/io.service';
import { Results } from 'src/app/model/import/results';
import { article } from 'src/app/model/import/article';
import { completedorder } from 'src/app/model/import/completedorder';
import { completedorders } from 'src/app/model/import/completedorders';
import { cycletimes } from 'src/app/model/import/cycletimes';
import { forecast } from 'src/app/model/import/forecast';
import { futureinwardstockmovement } from 'src/app/model/import/futureinwardstockmovement';
import { idletimecosts } from 'src/app/model/import/idletimecosts';
import { inwardstockmovement } from 'src/app/model/import/inwardstockmovement';
import { missingpart } from 'src/app/model/import/missingpart';
import { orderinwardstockmovement } from 'src/app/model/import/orderinwardstockmovement';
import { orderinwork } from 'src/app/model/import/orderinwork';
import { result } from 'src/app/model/import/result';
import { waitinglist } from 'src/app/model/import/waitinglist';
import { waitingliststock } from 'src/app/model/import/waitingliststock';
import { waitinglistworkstations } from 'src/app/model/import/waitinglistworkstations';
import { warehousestock } from 'src/app/model/import/warehousestock';
import { workplaceidletimecosts } from 'src/app/model/import/workplaceidletimecosts';
import { workplacewaitinglistworkstation } from 'src/app/model/import/workplaceWaitingListWorkstations';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  importedData: Results;
  inputData;
  fileUploadSuccessful: boolean;
  xmlParsingSuccessful: boolean;
  readFileSuccesful: boolean;
  file: File;

  importedDataKeys: string[] = [
    'game',
    'group',
    'period',
    'forecasts',
    'warehousestock',
    'inwardstockmovement',
    'futureinwardstockmovement',
    'idletimecosts',
    'waitinglistworkstations',
    'waitingliststock',
    'ordersinwork',
    'completedorders',
    'cycletimes',
    'result',
  ];
  prettyprintImportedData: boolean = false;

  constructor(private readonly ioService: IoService) {}

  ngOnInit(): void {
    console.log('');
  }

  // TODO: Prüfung, nur XML-Dateien
  // TODO: Upload, nur wenn eine Datei ausgewählt wurde
  onFileChange(event: any): void {
    this.fileUploadSuccessful = false;
    this.xmlParsingSuccessful = false;
    this.readFileSuccesful = false;

    console.log('file', event.target);
    this.file = event.target.files[0];
  }

  upload(): void {
    console.log('UPLOAD:', this.file);
    // FileReader objects can read from a file or a blob
    const reader: FileReader = new FileReader();
    // FileReader Events:
    // load – no errors, reading complete.
    // error – error has occurred.
    reader.addEventListener('load', (e) => {
      this.readFileSuccesful = true;

      const parsedXml = this.ioService.parseXml(reader.result);
      this.xmlParsingSuccessful = parsedXml !== undefined;
      this.inputData = parsedXml;

      if (this.xmlParsingSuccessful) this.loadData();
      //TODO: Else Fall: Fehlerbehandlung
    });

    // TODO: Fehlerbehandlung
    reader.addEventListener('error', (err) => {
      console.error('ERROR reading file:', reader.error);
      this.readFileSuccesful = false;
    });

    reader.readAsText(this.file, 'utf-8');
  }

  //-------------------------------------------------------------------------------------------
  // load-Methoden: Daten aus dem geparseten XML laden und in der Appliaktion verfügbar machen
  //-------------------------------------------------------------------------------------------

  // inputData verarbeiten und in der Anwendung bereitstellen
  // am besten über Subject, die abonniert werden können (Änderungen werden dann an alle Subscriber weitergeleitet - sehr wichtig!)
  // in dem Sinne benötigt man das Restults Interface gar nicht
  loadData(): void {
    // TODO: Fehler wenn this.inputData === undefined
    this.importedData = {
      game: this.loadGame(),
      period: this.loadPeriod(),
      group: this.loadGroup(),
      forecasts: this.loadForecast(),
      warehousestock: this.loadWarehouseStock(),
      inwardstockmovement: this.loadInwardStockMovement(),
      futureinwardstockmovement: this.loadFutureInwardStockMovement(),
      idletimecosts: this.loadIdleTimeCosts(),
      waitinglistworkstations: this.loadWaitingListWorkstations(),
      waitingliststock: this.loadWaitingListStock(),
      ordersinwork: this.loadOrdersInWork(),
      completedorders: this.loadCompletedOrders(),
      cycletimes: this.loadCycleTimes(),
      result: this.loadResult(),
    };
    this.fileUploadSuccessful = true;
    console.log('importedData', this.importedData);
  }

  loadGame(): number {
    const game: number = parseInt(this.inputData.results.attr.game);
    console.log('game', game);

    return game;
  }

  loadPeriod(): number {
    const period: number = parseInt(this.inputData.results.attr.period);
    console.log('period', period);
    return period;
  }

  loadGroup(): number {
    const group: number = parseInt(this.inputData.results.attr.group);
    console.log('group', group);
    return group;
  }

  loadForecast(): forecast {
    const forecastInput = this.inputData.results.forecast[0].attr;
    const forecast: forecast = this.createForecast(forecastInput);
    console.log('forecast', forecast);

    return forecast;
  }

  loadWarehouseStock(): warehousestock {
    const warehouseStockInput = this.inputData.results.warehousestock[0];
    const articles: article[] = warehouseStockInput.article.map((element) =>
      this.createArtice(element)
    );

    const totalStockValue: number = warehouseStockInput.totalstockvalue[0];
    const warehouseStock = {
      article: articles,
      totalstockvalue: totalStockValue,
    };
    console.log('warehousestock', warehouseStock);

    return warehouseStock;
  }

  loadInwardStockMovement(): inwardstockmovement {
    const inwardStockMovementInput =
      this.inputData.results.inwardstockmovement[0];
    // Check: gabe es in der letzen Periode überhaupt Materialeingänge?
    if (typeof inwardStockMovementInput === 'string') return undefined;

    const orders: orderinwardstockmovement[] =
      inwardStockMovementInput.order.map((element) =>
        this.createOrder(element)
      );

    const inwardStockMovement = {
      order: orders,
    };
    console.log('inwardstockmovement', inwardStockMovement);

    return inwardStockMovement;
  }

  loadFutureInwardStockMovement(): futureinwardstockmovement {
    const futureInwardStockMovementInput =
      this.inputData.results.futureinwardstockmovement[0];
    // Check: gibt es überhaupt zukünftige Materialeingänge?
    if (typeof futureInwardStockMovementInput === 'string') return undefined;

    const orders: orderinwardstockmovement[] =
      futureInwardStockMovementInput.order.map((element) =>
        this.createOrder(element)
      );

    const futureInwardStockMovement: futureinwardstockmovement = {
      order: orders,
    };
    console.log('futureinwardstockmovement', futureInwardStockMovement);

    return futureInwardStockMovement;
  }

  loadIdleTimeCosts(): idletimecosts {
    const idleTimeCostsInput = this.inputData.results.idletimecosts[0];
    // Check: gibt es überhaupt Leerzeiten in der letzen Periode?
    if (typeof idleTimeCostsInput === 'string') return undefined;

    const workplaces: workplaceidletimecosts[] =
      idleTimeCostsInput.workplace.map((element) =>
        this.createWorkplaceIdletimeCosts(element)
      );

    const sum = idleTimeCostsInput.sum[0].attr;

    const idleTimeCosts: idletimecosts = {
      workplace: workplaces,
      sum: sum,
    };
    console.log('idletimecosts', idleTimeCosts);

    return idleTimeCosts;
  }

  loadWaitingListWorkstations(): waitinglistworkstations {
    const waitinglistworkstationsInput =
      this.inputData.results.waitinglistworkstations[0];
    // Check: gibt es überhaupt Arbeitsplätze in der Warteschlange? Wenn nein, dann wurde <waitinglistworkstations/> als "" geparst
    if (typeof waitinglistworkstationsInput === 'string') return undefined;

    const workplaces: workplacewaitinglistworkstation[] =
      waitinglistworkstationsInput.workplace.map((element) =>
        this.createWorkplaceWaitingListStation(element)
      );

    const waitinglistworkstations: waitinglistworkstations = {
      workplace: workplaces,
    };
    console.log('waitinglistworkstations', waitinglistworkstations);

    return waitinglistworkstations;
  }

  loadWaitingListStock(): waitingliststock {
    const waitingListStockInput = this.inputData.results.waitingliststock[0];
    // Check: gibt es überhaupt Material in der Warteschlange? Wenn nein, dann wurde <waitingliststock/> als "" geparst
    if (typeof waitingListStockInput === 'string') return undefined;

    const missingParts: missingpart[] = waitingListStockInput.missingpart
      .filter((element) => element)
      .map((element) => {
        const missingPart: missingpart = {
          id: element.attr.id,
          workplace: element.workplace.map((workStationEntry) =>
            this.createWorkplaceWaitingListStation(workStationEntry)
          ),
        };
        return missingPart;
      });

    const waitingListStock: waitingliststock = {
      missingpart: missingParts,
    };
    console.log('waitingliststock', waitingListStock);

    return waitingListStock;
  }

  loadOrdersInWork(): orderinwork[] {
    const ordersInWorkInput = this.inputData.results.ordersinwork[0];
    // Check: gibt es überhaupt Aufträge in der Warteschlange, die gerade bearbeitet werden?
    if (typeof ordersInWorkInput === 'string') return undefined;

    const ordersInWork: orderinwork[] = ordersInWorkInput.workplace.map(
      (element) => this.createOrderInWork(element)
    );
    console.log('ordersinwork', ordersInWork);

    return ordersInWork;
  }

  loadCompletedOrders(): completedorders {
    const completeOrdersInput = this.inputData.results.completedorders[0];
    // Check: wurden in der letzen Periode überhaupt Aufträge abgeschlossen?
    if (typeof completeOrdersInput === 'string') return undefined;

    const orders: completedorder[] = completeOrdersInput.order.map((element) =>
      this.createCompletedOrder(element)
    );

    const completedOrders: completedorders = {
      order: orders,
    };
    console.log('completedorders', completedOrders);

    return completedOrders;
  }

  loadCycleTimes(): cycletimes {
    const cycleTimesInput = this.inputData.results.cycletimes[0];
    //TODO: was wenn der Tag leer ist?

    const cycleTimes: cycletimes = {
      startedorders: cycleTimesInput.attr.startedorders,
      waitingorders: cycleTimesInput.attr.waitingorders,
      order: cycleTimesInput.order.map((orderEntry) => orderEntry.attr),
    };
    console.log('cycletimes', cycleTimes);

    return cycleTimes;
  }

  loadResult(): result {
    const resultInput = this.inputData.results.result[0];
    const generalInput = resultInput.general[0];
    const defectiveGoodsInput = resultInput.defectivegoods[0];
    const normalSaleInpute = resultInput.normalsale[0];
    const directSaleInput = resultInput.directsale[0];
    const marketplaceSaleInput = resultInput.marketplacesale[0];
    const summaryInput = resultInput.summary[0];

    const results: result = {
      general: {
        capacity: generalInput.capacity[0].attr,
        possiblecapacity: generalInput.possiblecapacity[0].attr,
        relpossiblenormalcapacity:
          generalInput.relpossiblenormalcapacity[0].attr,
        productivetime: generalInput.productivetime[0].attr,
        effiency: generalInput.effiency[0].attr,
        sellwish: generalInput.sellwish[0].attr,
        salesquantity: generalInput.salesquantity[0].attr,
        deliveryreliability: generalInput.deliveryreliability[0].attr,
        idletime: generalInput.idletime[0].attr,
        idletimecosts: generalInput.idletimecosts[0].attr,
        storevalue: generalInput.storevalue[0].attr,
        storagecosts: generalInput.storagecosts[0].attr,
      },
      defectivegoods: {
        quantity: defectiveGoodsInput.quantity[0].attr,
        costs: defectiveGoodsInput.costs[0].attr,
      },
      normalsale: {
        salesprice: normalSaleInpute.salesprice[0].attr,
        profit: normalSaleInpute.profit[0].attr,
        profitperunit: normalSaleInpute.profitperunit[0].attr,
      },
      directsale: {
        profit: directSaleInput.profit[0].attr,
        contractpenalty: directSaleInput.contractpenalty[0].attr,
      },
      marketplacesale: {
        profit: marketplaceSaleInput.profit[0].attr,
      },
      summary: {
        profit: summaryInput.profit[0].attr,
      },
    };
    console.log('results', results);

    return results;
  }

  //-----------------------------------------------------------------------
  // create-Methoden: typisierte Objekte aus dem geparsten Xml erstellen
  //-----------------------------------------------------------------------
  createForecast(element: any): forecast {
    return {
      p1: element.p1,
      p2: element.p2,
      p3: element.p3,
    };
  }

  createArtice(element: any): article {
    return {
      id: element.attr.id,
      amount: element.attr.amount,
      pct: element.attr.pct,
      price: element.attr.price,
      startamount: element.attr.startamount,
      stockvalue: element.attr.stockvalue,
    };
  }

  createOrder(element: any): orderinwardstockmovement {
    return {
      id: element.attr.id,
      orderperiod: element.attr.orderperiod,
      mode: element.attr.mode,
      article: element.attr.article,
      amount: element.attr.amount,
      time: element.attr.time,
      materialcosts: element.attr.materialcosts,
      ordercosts: element.attr.ordercosts,
      entirecosts: element.attr.entirecosts,
      piececosts: element.attr.placecosts,
    };
  }

  createWaitingListEntry(element: any): waitinglist {
    return {
      period: element.attr.period,
      order: element.attr.order,
      firstbatch: element.attr.firstbatch,
      lastbatch: element.attr.lastbatch,
      item: element.attr.item,
      amount: element.attr.amount,
      timeneed: element.attr.timeneed,
    };
  }

  createWorkplaceWaitingListStation(
    element: any
  ): workplacewaitinglistworkstation {
    const hasWaitingList: boolean = element.hasOwnProperty('waitinglist');
    const waitingListAtWorkStation = !hasWaitingList
      ? undefined
      : element.waitinglist.map((waitingListEntry) => waitingListEntry.attr); //this.createWaitingListEntry(waitingListEntry));
    // Wenn es keine waitinglist gibt muss timeneed = 0 sein
    const timeneed = hasWaitingList ? element.attr.timeneed : '0';
    return {
      id: element.attr.id,
      timeneed: timeneed,
      waitinglist: waitingListAtWorkStation,
    };
  }

  createWorkplaceIdletimeCosts(element: any): workplaceidletimecosts {
    return {
      id: element.attr.id,
      setupevents: element.attr.setupevents,
      idletime: element.attr.idletime,
      wageidletimecosts: element.attr.wageidletimecosts,
      wagecosts: element.attr.wagecosts,
      machineidletimecosts: element.attr.machineidletimecosts,
    };
  }

  createOrderInWork(elemet: any): orderinwork {
    return {
      id: elemet.attr.id,
      period: elemet.attr.period,
      order: elemet.attr.order,
      batch: elemet.attr.batch,
      item: elemet.attr.item,
      amount: elemet.attr.amount,
      timeneed: elemet.attr.timeneed,
    };
  }

  createCompletedOrder(element: any): completedorder {
    return {
      period: element.attr.period,
      id: element.attr.id,
      item: element.attr.item,
      quantity: element.attr.quantity,
      cost: element.attr.cost,
      averageunitcosts: element.attr.averageunitcosts,
      batch: element.batch.map((batchEntry) => batchEntry.attr),
    };
  }
}
