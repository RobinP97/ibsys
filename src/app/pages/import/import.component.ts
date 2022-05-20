import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Article } from 'src/app/model/import/article';
import { CdkStepper } from '@angular/cdk/stepper';
import { CompletedOrder } from 'src/app/model/import/completedorder';
import { Cycletimes } from 'src/app/model/import/cycletimes';
import { DataService } from 'src/app/service/data.service';
import { Forecast } from 'src/app/model/import/forecast';
import { IdleTimeCosts } from 'src/app/model/import/idletimecosts';
import { IoService } from 'src/app/service/io.service';
import { MissingPart } from 'src/app/model/import/missingpart';
import { OrderInWork } from 'src/app/model/import/orderinwork';
import { OrderInwardStockMovement } from 'src/app/model/import/orderinwardstockmovement';
import { ParserOptions } from 'xml2js';
import { Result } from 'src/app/model/import/result';
import { Results } from 'src/app/model/import/results';
import { Router } from '@angular/router';
import { WaitingListEntry } from 'src/app/model/import/waitinglist';
import { WarehouseStock } from 'src/app/model/import/warehousestock';
import { WorkplaceIdletimeCosts } from 'src/app/model/import/workplaceidletimecosts';
import { WorkplaceWaitingListWorkstation } from 'src/app/model/import/workplaceWaitingListWorkstations';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent {
  importedData: Results;

  @ViewChild('fileUploader') fileUploader: ElementRef;

  fileUploadSuccessful: boolean = false;
  hasUplodError: boolean = false;
  errorMsgs: string[];

  @Input() xmlOptions: ParserOptions;

  // ausgewählte Datei
  file: File;
  // Rohtext
  readFileString: string;
  // geparster Rohtext als JSON-Objekt
  parsedXml: any;

  constructor(
    private readonly ioService: IoService,
    private readonly dataService: DataService,
    private readonly _stepper: CdkStepper
  ) {}

  // TODO: Weiterleitung, wenn der Uplaod geklappt hat + Nachricht
  onFileSelected(event: any): void {
    this.fileUploadSuccessful = false;
    this.hasUplodError = false;
    this.errorMsgs = [];

    this.file = undefined;
    this.readFileString = undefined;
    this.parsedXml = undefined;

    this.file = event.target.files[0];
    console.log('UPLOAD', event.target.files[0]);

    // Ist die hochgeladene Datei leer?
    if (this.file.size === 0)
      this.addErrorMessage('import.fileupload_emptyFile');

    // Wurde eine XML-Datei ausgewählt?
    if ('text/xml' !== this.file.type)
      this.addErrorMessage('import.fileupload_wrongFileType');

    // Voraussetzung für das Parsing nicht erfüllt => Abbrechen
    if (this.hasUplodError) return;

    // FileReader objects can read from a file or a blob
    const reader: FileReader = new FileReader();
    // FileReader Events:
    // load – no errors, reading complete.
    // error – error has occurred.
    reader.addEventListener('load', (e) => {
      this.readFileString = reader.result.toString();
      // Bei einem xml-parsing Fehler wird ein Error geworfen
      try {
        this.parsedXml = this.ioService.parseXml(
          reader.result,
          this.xmlOptions
        );
      } catch (e: any) {
        console.error('ERROR occured while parsing selected file.', e);
        this.addErrorMessage('import.fileupload_parsingError');
      }
    });

    // reader.addEventListener('error', (err) => {
    //   console.error('ERROR reading file:', reader.error);
    //   this.readFileSuccesful = false;
    // });

    reader.readAsText(this.file, 'utf-8');
  }

  addErrorMessage(errorMsg: string): void {
    this.hasUplodError = true;
    this.errorMsgs.push(errorMsg);
  }

  //-------------------------------------------------------------------------------------------
  // load-Methoden: Daten aus dem geparseten XML laden und in der Appliaktion verfügbar machen
  //-------------------------------------------------------------------------------------------

  loadData(): void {
    try {
      this.dataService.resetData();
      this.dataService.importFileStatus(false);
      this.importedData = {
        game: this.loadGame(),
        group: this.loadGroup(),
        period: this.loadPeriod(),
        forecast: this.loadMandatoryOrders(),
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
      // TODO: Erfolgsanzeige Snackbar
      // App informieren: Import erfolgreich und abgeschlossen
      this.dataService.importFileStatus(true);
      // Weiterleitung zum nächsten Schritt
      this._stepper.next();
    } catch (e: unknown) {
      console.error('Error occured while loading the data:', e);
      this.dataService.resetData();

      this.importedData = undefined;
      this.readFileString = undefined;
      this.parsedXml = undefined;

      this.fileUploadSuccessful = false;
      this.hasUplodError = true;
      this.errorMsgs.push('import.fileupload_loadDataError');

      this.dataService.importFileStatus(false);
      this.fileUploader.nativeElement.value = '';
    }
  }

  loadGame(): number {
    const game: number = this.parsedXml.results.attr.game;
    this.dataService.setGame(game);

    return game;
  }

  loadPeriod(): number {
    const period: number = this.parsedXml.results.attr.period;
    this.dataService.setPeriod(period);

    return period;
  }

  loadGroup(): number {
    const group: number = this.parsedXml.results.attr.group;
    this.dataService.setGroup(group);

    return group;
  }

  loadMandatoryOrders(): Forecast {
    const mandatoryOrdersInput = this.parsedXml.results.forecast[0].attr;
    const mandatoryOrders: Forecast = this.createForecast(mandatoryOrdersInput);
    this.dataService.setMandatoryOrders(mandatoryOrders);

    return mandatoryOrders;
  }

  loadWarehouseStock(): WarehouseStock {
    const warehouseStockInput = this.parsedXml.results.warehousestock[0];
    const articles: Article[] = warehouseStockInput.article.map((element) =>
      this.createArtice(element)
    );

    const totalStockValue: number = warehouseStockInput.totalstockvalue[0];
    const warehouseStock = {
      article: articles,
      totalstockvalue: totalStockValue,
    };
    this.dataService.setWarehouseStock(warehouseStock);

    return warehouseStock;
  }

  loadInwardStockMovement(): OrderInwardStockMovement[] {
    const inwardStockMovementInput =
      this.parsedXml.results.inwardstockmovement[0];
    // Check: gabe es in der letzen Periode überhaupt Materialeingänge?
    if (typeof inwardStockMovementInput === 'string') return [];

    const orders: OrderInwardStockMovement[] =
      inwardStockMovementInput.order.map((element) =>
        this.createOrder(element)
      );
    this.dataService.setInwardStockMovement(orders);

    return orders;
  }

  loadFutureInwardStockMovement(): OrderInwardStockMovement[] {
    const futureInwardStockMovementInput =
      this.parsedXml.results.futureinwardstockmovement[0];
    // Check: gibt es überhaupt zukünftige Materialeingänge?
    if (typeof futureInwardStockMovementInput === 'string') return [];

    const orders: OrderInwardStockMovement[] =
      futureInwardStockMovementInput.order.map((element) =>
        this.createOrder(element)
      );
    this.dataService.setFutureInwardStockMovement(orders);

    return orders;
  }

  loadIdleTimeCosts(): IdleTimeCosts {
    const idleTimeCostsInput = this.parsedXml.results.idletimecosts[0];
    // Check: gibt es überhaupt Leerzeiten in der letzen Periode?
    if (typeof idleTimeCostsInput === 'string') return undefined;

    const idletimeCostsWorkplaces: WorkplaceIdletimeCosts[] =
      idleTimeCostsInput.workplace.map((element) =>
        this.createWorkplaceIdletimeCosts(element)
      );

    const sum = idleTimeCostsInput.sum[0].attr;

    const idleTimeCosts: IdleTimeCosts = {
      workplace: idletimeCostsWorkplaces,
      sum: sum,
    };
    this.dataService.setIdleTimeCosts(idleTimeCosts);

    return idleTimeCosts;
  }

  loadWaitingListWorkstations(): WorkplaceWaitingListWorkstation[] {
    const waitinglistworkstationsInput =
      this.parsedXml.results.waitinglistworkstations[0];
    // Check: gibt es überhaupt Arbeitsplätze in der Warteschlange? Wenn nein, dann wurde <waitinglistworkstations/> als "" geparst
    if (typeof waitinglistworkstationsInput === 'string') return [];

    const waitingListWorkplaces: WorkplaceWaitingListWorkstation[] =
      waitinglistworkstationsInput.workplace.map((element) =>
        this.createWorkplaceWaitingListStation(element)
      );
    this.dataService.setWaitingListWorkstations(waitingListWorkplaces);

    return waitingListWorkplaces;
  }

  loadWaitingListStock(): MissingPart[] {
    const waitingListStockInput = this.parsedXml.results.waitingliststock[0];
    // Check: gibt es überhaupt Material in der Warteschlange? Wenn nein, dann wurde <waitingliststock/> als "" geparst
    if (typeof waitingListStockInput === 'string') return [];

    const missingParts: MissingPart[] = waitingListStockInput.missingpart.map(
      (element) => this.createMissingPart(element)
    );
    this.dataService.setWaitingListStock(missingParts);

    return missingParts;
  }

  loadOrdersInWork(): OrderInWork[] {
    const ordersInWorkInput = this.parsedXml.results.ordersinwork[0];
    // Check: gibt es überhaupt Aufträge in der Warteschlange, die gerade bearbeitet werden?
    if (typeof ordersInWorkInput === 'string') return [];

    const ordersInWork: OrderInWork[] = ordersInWorkInput.workplace.map(
      (element) => this.createOrderInWork(element)
    );
    this.dataService.setOrdersInWork(ordersInWork);

    return ordersInWork;
  }

  loadCompletedOrders(): CompletedOrder[] {
    const completeOrdersInput = this.parsedXml.results.completedorders[0];
    // Check: wurden in der letzen Periode überhaupt Aufträge abgeschlossen?
    if (typeof completeOrdersInput === 'string') return [];

    const completedOrders: CompletedOrder[] = completeOrdersInput.order.map(
      (element) => this.createCompletedOrder(element)
    );
    this.dataService.setCompletedOrders(completedOrders);

    return completedOrders;
  }

  loadCycleTimes(): Cycletimes {
    const cycleTimesInput = this.parsedXml.results.cycletimes[0];
    //TODO: was wenn der Tag leer ist?

    const cycleTimes: Cycletimes = this.createCycletimes(cycleTimesInput);
    this.dataService.setCycleTimes(cycleTimes);

    return cycleTimes;
  }

  loadResult(): Result {
    const resultInput = this.parsedXml.results.result[0];
    const generalInput = resultInput.general[0];
    const defectiveGoodsInput = resultInput.defectivegoods[0];
    const normalSaleInpute = resultInput.normalsale[0];
    const directSaleInput = resultInput.directsale[0];
    const marketplaceSaleInput = resultInput.marketplacesale[0];
    const summaryInput = resultInput.summary[0];

    const result: Result = {
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
    this.dataService.setResults(result);

    return result;
  }

  //-----------------------------------------------------------------------
  // create-Methoden: typisierte Objekte aus dem geparsten Xml erstellen
  //-----------------------------------------------------------------------
  createForecast(element: any): Forecast {
    return {
      p1: element.p1,
      p2: element.p2,
      p3: element.p3,
    };
  }

  createArtice(element: any): Article {
    return {
      id: element.attr.id,
      amount: element.attr.amount,
      startamount: element.attr.startamount,
      pct: element.attr.pct,
      price: element.attr.price,
      stockvalue: element.attr.stockvalue,
    };
  }

  createOrder(element: any): OrderInwardStockMovement {
    return {
      orderperiod: element.attr.orderperiod,
      id: element.attr.id,
      mode: element.attr.mode,
      article: element.attr.article,
      amount: element.attr.amount,
      time: element.attr.time,
      materialcosts: element.attr.materialcosts,
      ordercosts: element.attr.ordercosts,
      entirecosts: element.attr.entirecosts,
      piececosts: element.attr.piececosts,
    };
  }

  createWaitingListEntry(element: any): WaitingListEntry {
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
  ): WorkplaceWaitingListWorkstation {
    const hasWaitingList: boolean = element.hasOwnProperty('waitinglist');
    const waitingListAtWorkStation = !hasWaitingList
      ? undefined
      : element.waitinglist.map((waitingListEntry) => waitingListEntry.attr); //this.createWaitingListEntry(waitingListEntry));
    // Wenn es keine waitinglist gibt muss timeneed = 0 sein
    const timeneed = hasWaitingList ? element.attr.timeneed : 0;
    return {
      id: element.attr.id,
      timeneed: timeneed,
      waitinglist: waitingListAtWorkStation,
    };
  }

  createWorkplaceIdletimeCosts(element: any): WorkplaceIdletimeCosts {
    return {
      id: element.attr.id,
      setupevents: element.attr.setupevents,
      idletime: element.attr.idletime,
      wageidletimecosts: element.attr.wageidletimecosts,
      wagecosts: element.attr.wagecosts,
      machineidletimecosts: element.attr.machineidletimecosts,
    };
  }

  createMissingPart(element: any): MissingPart {
    return {
      id: element.attr.id,
      workplace: element.workplace.map((workStationEntry) =>
        this.createWorkplaceWaitingListStation(workStationEntry)
      ),
    };
  }

  createOrderInWork(elemet: any): OrderInWork {
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

  createCompletedOrder(element: any): CompletedOrder {
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

  createCycletimes(element: any): Cycletimes {
    return {
      startedorders: element.attr.startedorders,
      waitingorders: element.attr.waitingorders,
      order: element.order.map((orderEntry) => orderEntry.attr),
    };
  }
}
