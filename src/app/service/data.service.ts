import { CompletedOrder } from '../model/import/completedorder';
import { Cycletimes } from '../model/import/cycletimes';
import { Forecast } from '../model/import/forecast';
import { IdleTimeCosts } from '../model/import/idletimecosts';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { MissingPart } from '../model/import/missingpart';
import { OrderInWork } from '../model/import/orderinwork';
import { OrderInwardStockMovement } from '../model/import/orderinwardstockmovement';
import { Production } from '../model/production/production';
import { Result } from '../model/import/result';
import { STEPS } from '../shared/production-planning-steps';
import { Subject } from 'rxjs';
import { WarehouseStock } from '../model/import/warehousestock';
import { WorkplaceWaitingListWorkstation } from '../model/import/workplaceWaitingListWorkstations';
import { localStorageKeys as keys } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  game$ = new Subject<number>();
  group$ = new Subject<number>();
  period$ = new Subject<number>();

  mandatoryOrders$ = new Subject<Forecast>();
  forecasts$ = new Subject<Forecast[]>();
  directsales$ = new Subject<Forecast>();
  warehouseStock$ = new Subject<WarehouseStock>();
  inwardStockMovement$ = new Subject<OrderInwardStockMovement[]>();
  futureInwardStockMovement$ = new Subject<OrderInwardStockMovement[]>();
  idleTimeCosts$ = new Subject<IdleTimeCosts>();
  waitinglistworkstations$ = new Subject<WorkplaceWaitingListWorkstation[]>();
  waitingListStock$ = new Subject<MissingPart[]>();
  ordersInWork$ = new Subject<OrderInWork[]>();
  completedOrders$ = new Subject<CompletedOrder[]>();
  cycleTimes$ = new Subject<Cycletimes>();
  result$ = new Subject<Result>();
  production$ = new Subject<Production[]>();

  fileUploadSuccessful$ = new Subject<boolean>();
  completedProductionPlanningStep$ = new Subject<any>();

  //... und weitere die wir brauchen
  // Mit Subjects können wir einer Menge an Abonnenten Änderungen an relevanten Daten mitteilen
  // Die Abonnenten können kann die Daten z.B. mit der Async-Pipe darstellen

  constructor(private readonly localStorageService: LocalStorageService) {}

  resetData() {
    this.localStorageService.clear();
  }

  //-------------------------------------------------------------------------------------------
  // Methoden zur Steuerung der nav-bar-planning
  //-------------------------------------------------------------------------------------------

  // War der Import erfolgreich
  importFileStatus(success: boolean) {
    this.fileUploadSuccessful$.next(success);
    // Status completed an alle Schritte senden: 1-x auf false zurücksetzen
    for (let step of STEPS) {
      this.updateProductionPlanningStep(
        step.index === 0 ? success : false,
        step.index
      );
    }
  }

  // Setze für einen mat-step mit index=index, dessen Property completed auf true oder false
  updateProductionPlanningStep(completed: boolean, index: number) {
    this.completedProductionPlanningStep$.next({ index, completed });
  }

  // Prüft, ob die Daten einer Datein scnon im Borwsercache liegen
  checkBrowsercache4ImportedFileData(): boolean {
    for (let key of ['GAME', 'GROUP', 'PERIOD']) {
      const value = keys.import[key];
      const isLoaded = this.localStorageService.getItem(value) != undefined;
      if (!isLoaded) return false;
    }
    return true;
  }

  //-------------------------------------------------------------------------------------------
  // get-Methoden: Holen Daten aus dem Browerchache
  //-------------------------------------------------------------------------------------------
  getPeriod(): number {
    const period = this.localStorageService.getItem(keys.import.PERIOD);
    return period;
  }

  getForcasts(): Forecast[] {
    const forecasts: Forecast[] = this.localStorageService.getItem(
      keys.other.FORECASTS
    );

    return forecasts === undefined
      ? ([{}, {}, {}, {}] as Forecast[])
      : forecasts;
  }

  getMandatoryOrders(): Forecast {
    const mandatoryOrders = this.localStorageService.getItem(
      keys.import.MANDATORYORDERS
    );
    return mandatoryOrders;
  }

  getDirectSales(): Forecast {
    const directsales: Forecast = this.localStorageService.getItem(
      keys.other.DIRECTSALES
    );
    return directsales === undefined ? ({} as Forecast) : directsales;
  }

  getForecastsAndDirectSales() {
    const combined = this.localStorageService.getItem(
      keys.other.FORECASTANDDIRECTSALES
    );
    return combined;
  }

  getWaitinglistWorkstations(): WorkplaceWaitingListWorkstation[] {
    const waitinglistWorkStation: WorkplaceWaitingListWorkstation[] =
      this.localStorageService.getItem(keys.import.WAITINGLISTWORKSTATIONS);
    return waitinglistWorkStation;
  }

  getWarehouseStock(): WarehouseStock {
    const warehouseStock: WarehouseStock = this.localStorageService.getItem(
      keys.import.WAREHOUSESTOCK
    );
    return warehouseStock;
  }

  getOrdersInWork(): OrderInWork[] {
    const ordersInWork: OrderInWork[] = this.localStorageService.getItem(
      keys.import.ORDERSINWORK
    );
    return ordersInWork;
  }

  getProductionOrders(): Production[] {
    const productionOrders: Production[] = this.localStorageService.getItem(
      keys.other.PRODUCTIONORDERS
    );
    return productionOrders;
  }

  getProductionOrdersWithResolvedSplits(): Production[] {
    const productionOrders: Production[] = this.localStorageService.getItem(
      keys.other.PRODUCTIONORDERS
    );
    const resolvedProductionOrders: Production[] = [];
    productionOrders.forEach((p) => {
      p.splits?.forEach((s) => {
        // Verbindliche Auftrage - Splitmenge
        p.binding_orders = p.binding_orders - s.amount;
        // Split als neuer Auftrag für die Anzeige
        const resolvedSplit = Object.assign({}, p);
        resolvedSplit.binding_orders = s.amount;
        resolvedSplit.sequencePos = s.sequencePos;
        resolvedSplit.splits = undefined;
        resolvedProductionOrders.push(resolvedSplit);
      });
    });
    productionOrders.push(...resolvedProductionOrders);
    productionOrders.sort((a, b) => a.sequencePos - b.sequencePos);
    return productionOrders;
  }

  //-------------------------------------------------------------------------------------------
  // get-Methoden: Schreibe Daten in den Browerchache und informiere die relevanten Abonnenten
  //-------------------------------------------------------------------------------------------
  setGame(game: number) {
    this.game$.next(game);
    this.localStorageService.setItem(keys.import.GAME, game);
  }

  setPeriod(period: number) {
    this.period$.next(period);
    this.localStorageService.setItem(keys.import.PERIOD, period);
  }

  setGroup(group: number) {
    this.period$.next(group);
    this.localStorageService.setItem(keys.import.GROUP, group);
  }

  setMandatoryOrders(mandatoryOrders: Forecast) {
    this.mandatoryOrders$.next(mandatoryOrders);
    this.localStorageService.setItem(
      keys.import.MANDATORYORDERS,
      mandatoryOrders
    );
    // forecasts: verbindliche Aufträge, Prognose p2, prognose p3, prognose p4
    const forecasts: Forecast[] = this.getForcasts();
    forecasts[0] = mandatoryOrders;
    this.forecasts$.next(forecasts);
    this.localStorageService.setItem(keys.other.FORECASTS, forecasts);
  }

  setWarehouseStock(warehouseStock: WarehouseStock) {
    this.warehouseStock$.next(warehouseStock);
    this.localStorageService.setItem(
      keys.import.WAREHOUSESTOCK,
      warehouseStock
    );
  }

  setInwardStockMovement(inwardStockMovement: OrderInwardStockMovement[]) {
    this.inwardStockMovement$.next(inwardStockMovement);
    this.localStorageService.setItem(
      keys.import.INWARDSTOCKMOVEMENT,
      inwardStockMovement
    );
  }

  setFutureInwardStockMovement(
    futureInwardStockMovement: OrderInwardStockMovement[]
  ) {
    this.futureInwardStockMovement$.next(futureInwardStockMovement);
    this.localStorageService.setItem(
      keys.import.FUTUREINWARDSTOCKMOVEMENT,
      futureInwardStockMovement
    );
  }

  setIdleTimeCosts(idleTimeCosts: IdleTimeCosts) {
    this.idleTimeCosts$.next(idleTimeCosts);
    this.localStorageService.setItem(keys.import.IDLETIMECOSTS, idleTimeCosts);
  }

  setWaitingListWorkstations(
    waitinglistworkstations: WorkplaceWaitingListWorkstation[]
  ) {
    this.waitinglistworkstations$.next(waitinglistworkstations);
    this.localStorageService.setItem(
      keys.import.WAITINGLISTWORKSTATIONS,
      waitinglistworkstations
    );
  }

  setWaitingListStock(waitingListStock: MissingPart[]) {
    this.waitingListStock$.next(waitingListStock);
    this.localStorageService.setItem(
      keys.import.WAITINGLISTSTOCK,
      waitingListStock
    );
  }

  setOrdersInWork(ordersInWork: OrderInWork[]) {
    this.ordersInWork$.next(ordersInWork);
    this.localStorageService.setItem(keys.import.ORDERSINWORK, ordersInWork);
  }

  setCompletedOrders(completedOrders: CompletedOrder[]) {
    this.completedOrders$.next(completedOrders);
    this.localStorageService.setItem(
      keys.import.COMPLETEDORDERS,
      completedOrders
    );
  }

  setCycleTimes(cycleTimes: Cycletimes) {
    this.cycleTimes$.next(cycleTimes);
    this.localStorageService.setItem(keys.import.CYCLETIMES, cycleTimes);
  }

  setResults(result: Result) {
    this.result$.next(result);
    this.localStorageService.setItem(keys.import.RESULT, result);
  }

  setForecasts(forecasts: Forecast[]) {
    this.forecasts$.next(forecasts);
    this.localStorageService.setItem(keys.other.FORECASTS, forecasts);
    const mandatoryOrder = forecasts[0];
    this.mandatoryOrders$.next(mandatoryOrder);
    this.localStorageService.setItem(
      keys.import.MANDATORYORDERS,
      mandatoryOrder
    );
    this.setForecastsAndDirectSales();
  }

  setDirectSales(directsales: Forecast) {
    this.directsales$.next(directsales);
    this.localStorageService.setItem(keys.other.DIRECTSALES, directsales);
    this.setForecastsAndDirectSales();
  }

  setForecastsAndDirectSales() {
    const forecasts = this.getForcasts();
    const directsales = this.getDirectSales();
    const combined = [...forecasts];

    // ?? => Nullish coalescing operator
    combined[0]['p1'] += directsales?.p1 ?? 0;
    combined[0]['p2'] += directsales?.p2 ?? 0;
    combined[0]['p3'] += directsales?.p3 ?? 0;

    this.localStorageService.setItem(
      keys.other.FORECASTANDDIRECTSALES,
      combined
    );
  }

  setProductionOrders(productionOrders: Production[]) {
    this.production$.next(productionOrders);
    this.localStorageService.setItem(
      keys.other.PRODUCTIONORDERS,
      productionOrders
    );
  }
}
