import { Component, OnInit } from '@angular/core';

import { Article } from 'src/app/model/import/article';
import { CompletedOrder } from 'src/app/model/import/completedorder';
import { Cycletimes } from 'src/app/model/import/cycletimes';
import { Forecast } from 'src/app/model/import/forecast';
import { IdleTimeCosts } from 'src/app/model/import/idletimecosts';
import { IoService } from 'src/app/service/io.service';
import { MissingPart } from 'src/app/model/import/missingpart';
import { OrderInwardStockMovement } from 'src/app/model/import/orderinwardstockmovement';
import { OrderInwork } from 'src/app/model/import/orderinwork';
import { Result } from 'src/app/model/import/result';
import { Results } from 'src/app/model/import/results';
import { WaitingListEntry } from 'src/app/model/import/waitinglist';
import { WarehouseStock } from 'src/app/model/import/warehousestock';
import { WorkplaceIdletimeCosts } from 'src/app/model/import/workplaceidletimecosts';
import { WorkplaceWaitingListWorkstation } from 'src/app/model/import/workplaceWaitingListWorkstations';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  importedData: Results;
  

  fileUploadSuccessful: boolean;
  xmlParsingSuccessful: boolean;
  readFileSuccesful: boolean;

  file: File;
  parsedXml: any;
  readFileString: string;
  jsonToXmlString: string;

  importedDataKeys: string[] = [
    'game',
    'group',
    'period',
    'forecast',
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
      this.readFileString = reader.result.toString();

      this.parsedXml = this.ioService.parseXml(reader.result);
      console.log('Reader', reader.result);  
      this.xmlParsingSuccessful = this.parsedXml !== undefined;

      if (this.xmlParsingSuccessful) this.loadData();
      if (this.fileUploadSuccessful) console.log('Result', reader.result.toString().length, this.jsonToXml().length);
  
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
      group: this.loadGroup(),
      period: this.loadPeriod(),
      forecast: this.loadForecast(),
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
    const game: number = parseInt(this.parsedXml.results.attr.game);
    console.log('game', game);

    return game;
  }

  loadPeriod(): number {
    const period: number = parseInt(this.parsedXml.results.attr.period);
    console.log('period', period);
    return period;
  }

  loadGroup(): number {
    const group: number = parseInt(this.parsedXml.results.attr.group);
    console.log('group', group);
    return group;
  }

  loadForecast(): Forecast {
    const forecastInput = this.parsedXml.results.forecast[0].attr;
    const forecast: Forecast = this.createForecast(forecastInput);
    console.log('forecast', forecast);

    return forecast;
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
    console.log('warehousestock', warehouseStock);

    return warehouseStock;
  }

  loadInwardStockMovement(): OrderInwardStockMovement[] {
    const inwardStockMovementInput =
      this.parsedXml.results.inwardstockmovement[0];
    // Check: gabe es in der letzen Periode überhaupt Materialeingänge?
    if (typeof inwardStockMovementInput === 'string') return undefined;

    const orders: OrderInwardStockMovement[] = inwardStockMovementInput.order.map((element) => this.createOrder(element));
    console.log('inwardstockmovement', orders);

    return orders;
  }

  loadFutureInwardStockMovement(): OrderInwardStockMovement[] {
    const futureInwardStockMovementInput =
      this.parsedXml.results.futureinwardstockmovement[0];
    // Check: gibt es überhaupt zukünftige Materialeingänge?
    if (typeof futureInwardStockMovementInput === 'string') return undefined;

    const orders: OrderInwardStockMovement[] =
      futureInwardStockMovementInput.order.map((element) =>
        this.createOrder(element)
      );
    console.log('futureinwardstockmovement', orders);

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
    console.log('idletimecosts', idleTimeCosts);

    return idleTimeCosts;
  }

  loadWaitingListWorkstations(): WorkplaceWaitingListWorkstation[] {
    const waitinglistworkstationsInput =
      this.parsedXml.results.waitinglistworkstations[0];
    // Check: gibt es überhaupt Arbeitsplätze in der Warteschlange? Wenn nein, dann wurde <waitinglistworkstations/> als "" geparst
    if (typeof waitinglistworkstationsInput === 'string') return undefined;

    const waitingListWorkplaces: WorkplaceWaitingListWorkstation[] =
      waitinglistworkstationsInput.workplace.map((element) =>
        this.createWorkplaceWaitingListStation(element)
      );

    console.log('waitinglistworkstations', waitingListWorkplaces);

    return waitingListWorkplaces;
  }

  loadWaitingListStock(): MissingPart[] {
    const waitingListStockInput = this.parsedXml.results.waitingliststock[0];
    // Check: gibt es überhaupt Material in der Warteschlange? Wenn nein, dann wurde <waitingliststock/> als "" geparst
    if (typeof waitingListStockInput === 'string') return undefined;

    const missingParts: MissingPart[] = waitingListStockInput.missingpart
      // .filter((element) => element)
      .map((element) => this.createMissingPart(element));

    console.log('waitingliststock', missingParts);

    return missingParts;
  }

  loadOrdersInWork(): OrderInwork[] {
    const ordersInWorkInput = this.parsedXml.results.ordersinwork[0];
    // Check: gibt es überhaupt Aufträge in der Warteschlange, die gerade bearbeitet werden?
    if (typeof ordersInWorkInput === 'string') return undefined;

    const ordersInWork: OrderInwork[] = ordersInWorkInput.workplace.map(
      (element) => this.createOrderInWork(element)
    );
    console.log('ordersinwork', ordersInWork);

    return ordersInWork;
  }

  loadCompletedOrders(): CompletedOrder[] {
    const completeOrdersInput = this.parsedXml.results.completedorders[0];
    // Check: wurden in der letzen Periode überhaupt Aufträge abgeschlossen?
    if (typeof completeOrdersInput === 'string') return undefined;

    const completedOrders: CompletedOrder[] = completeOrdersInput.order.map((element) =>
      this.createCompletedOrder(element)
    );

    console.log('completedorders', completedOrders);

    return completedOrders;
  }

  loadCycleTimes(): Cycletimes {
    const cycleTimesInput = this.parsedXml.results.cycletimes[0];
    //TODO: was wenn der Tag leer ist?

    const cycleTimes: Cycletimes = this.createCycletimes(cycleTimesInput);
    console.log('cycletimes', cycleTimes);

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

    const results: Result = {
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
    const timeneed = hasWaitingList ? element.attr.timeneed : '0';
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

  createOrderInWork(elemet: any): OrderInwork {
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

  //-----------------------------------------------------------------------
  // validierung: json to xml
  //-----------------------------------------------------------------------
  jsonToXml(): string {
    // Wenn property vom type string oder number, dann attribut
    // Wenn property vom Type array, dann liste von tag
    // Wenn property vom Type object, dann ein Tag
    // let tag = `<results game="${this.importedData.game}" group="${this.importedData.group}" period="${this.importedData.period}">\n`
    // const keys: string[] = [
    //   'forecast',
    //   'warehousestock',
    //   'inwardstockmovement',
    //   'futureinwardstockmovement',
    //   'idletimecosts',
    //   'waitinglistworkstations',
    //   'waitingliststock',
    //   'ordersinwork',
    //   'completedorders',
    //   'cycletimes',
    //   'result',
    // ];
    const tagHelper = new Map([
      ['ordersinwork', 'workplace'],
      ['inwardstockmovement', 'order'],
      ['futureinwardstockmovement', 'order'],
      ['waitinglistworkstations', 'workplace'],
      ['waitingliststock', 'missingpart'],
      ['ordersinwork', 'workplace'],
      ['completedorders', 'order']
    ]);
    const emptyTags = [
      'forecast',
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
    // for (let key of keys) {
    //   console.log('import key:', key);      
    //   tag +=  this.parseProperty(this.importedData[key], key, tagHelper);
    //   console.log('done with key', key);
    // }
    // tag +=  this.parseProperty(this.importedData.ordersinwork, 'ordersinwork', tagHelper);
    // tag += '</results>';
    let tag = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
    tag += this.parseProperty( this.importedData, 'results', tagHelper, emptyTags);
    console.log('jsonToXml', tag);
    return tag;
  }


  parseProperty(object: any, tagname: string, tagHelper: Map<string, string>, emptyTags: string[]) {   
    if (object === undefined || Object.keys(object).length === 0) return `<${tagname}/>`;// opt: Zeilenumbruch
    let tag = `<${tagname}`;
    let subObjectKeys: string[] = [];
    // Attribute
    for (let key in object) {
      let value = object[key];
      if (value === undefined) {
        if (emptyTags.includes(key)) subObjectKeys.push(key);
        continue;
      } 
      // Spezialfall
      let isAttribute = typeof value !== 'object';
      if (key === 'totalstockvalue') {
        subObjectKeys.push('totalstockvalue');
        continue;
      }
      if (isAttribute) {
        tag += ` ${key}="${value}"`;
      } else {
        subObjectKeys.push(key);
      }
    }
    
    // geschachtelte Tags
    if (subObjectKeys.length > 0) {
      tag += ">";//
      for (let key of subObjectKeys) {
        let value = object[key];
        // Spezialfall
        if (key === 'totalstockvalue') {
          tag += `<totalstockvalue>${value}</totalstockvalue>`// opt: Zeilenumbruch
          continue;
        }      
        if (tagHelper.has(key)) {
          if (value !== undefined) {
            tag += `<${key}>`;
            for (let entry of value) {
              tag += this.parseProperty(entry, tagHelper.get(key), tagHelper, emptyTags);
            }
            tag += `</${key}>`;
          } else {
            tag += `<${key}/>`;
          }
        } else {
          value = Array.isArray(value) ? value : [value]
          for (let entry of value) {
            tag += this.parseProperty(entry, key, tagHelper, emptyTags);
          }
        }
      }
      tag += `</${tagname}>`;// opt: Zeilenumbruch
    } else {
      tag += "/>";// opt: Zeilenumbruch
    }
    return tag;
  }

  testXmlTextEquality() {
    return this.readFileString.length === this.jsonToXmlString.length;
  }

  findFirstDifference(a: string, b: string) {
    return (a, b) => {
        a = [...a];
        b = [...b];
        return b.find((char, i) => {
        // console.log(i, 'char', `"${char}"` , `"${a[i]}"`);
        return {
          pos: i,
          difference : {
            a: a[i],
            b: char,
          }
        };
      });
    };      
  }
}
