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
import { Subject } from 'rxjs';
import { WarehouseStock } from '../model/import/warehousestock';
import { WorkplaceWaitingListWorkstation } from '../model/import/workplaceWaitingListWorkstations';
import { localStorageKeys as key } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  game$ = new Subject<number>();
  group$ = new Subject<number>();
  period$ = new Subject<number>();

  mandatoryOrders$ = new Subject<Forecast>();
  forecasts$ = new Subject<Forecast[]>();
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

  //... und weitere die wir brauchen
  // Mit Subjects können wir einer Menge an Abonnenten Änderungen an relevanten Daten mitteilen
  // Die Abonnenten können kann die Daten z.B. mit der Async-Pipe darstellen

  constructor(private readonly localStorageService: LocalStorageService) {}

  resetData() {
    this.localStorageService.clear();
  }

  //-------------------------------------------------------------------------------------------
  // get-Methoden: Holen Daten aus dem Browerchache
  //-------------------------------------------------------------------------------------------
  getForcasts(): Forecast[] {
    const forecasts: Forecast[] = this.localStorageService.getItem(
      key.FORECASTS
    );

    return forecasts === undefined
      ? ([{}, {}, {}, {}] as Forecast[])
      : forecasts;
  }

  getWaitinglistWorkstations(): WorkplaceWaitingListWorkstation[] {
    const waitinglistWorkStation: WorkplaceWaitingListWorkstation[] =
      this.localStorageService.getItem(key.WAITINGLISTWORKSTATIONS);
    return waitinglistWorkStation;
  }

  getWarehouseStock(): WarehouseStock {
    const warehouseStock: WarehouseStock = this.localStorageService.getItem(
      key.WAREHOUSESTOCK
    );
    return warehouseStock;
  }

  getOrdersInWork(): OrderInWork[] {
    const ordersInWork: OrderInWork[] = this.localStorageService.getItem(
      key.ORDERSINWORK
    );
    return ordersInWork;
  }
  //-------------------------------------------------------------------------------------------
  // get-Methoden: Schreibe Daten in den Browerchache und informiere die relevanten Abonnenten
  //-------------------------------------------------------------------------------------------
  setGame(game: number) {
    this.game$.next(game);
    this.localStorageService.setItem(key.GAME, game);
  }

  setPeriod(period: number) {
    this.period$.next(period);
    this.localStorageService.setItem(key.PERIOD, period);
  }

  setGroup(group: number) {
    this.period$.next(group);
    this.localStorageService.setItem(key.GROUP, group);
  }

  setMandatoryOrders(mandatoryOrders: Forecast) {
    this.mandatoryOrders$.next(mandatoryOrders);
    this.localStorageService.setItem(key.MANDATORYORDERS, mandatoryOrders);
    // forecasts: verbindliche Aufträge, Prognose p2, prognose p3, prognose p4
    const forecasts: Forecast[] = this.getForcasts();
    forecasts[0] = mandatoryOrders;
    this.forecasts$.next(forecasts);
    this.localStorageService.setItem(key.FORECASTS, forecasts);
  }

  setWarehouseStock(warehouseStock: WarehouseStock) {
    this.warehouseStock$.next(warehouseStock);
    this.localStorageService.setItem(key.WAREHOUSESTOCK, warehouseStock);
  }

  setInwardStockMovement(inwardStockMovement: OrderInwardStockMovement[]) {
    this.inwardStockMovement$.next(inwardStockMovement);
    this.localStorageService.setItem(
      key.INWARDSTOCKMOVEMENT,
      inwardStockMovement
    );
  }

  setFutureInwardStockMovement(
    futureInwardStockMovement: OrderInwardStockMovement[]
  ) {
    this.futureInwardStockMovement$.next(futureInwardStockMovement);
    this.localStorageService.setItem(
      key.FUTUREINWARDSTOCKMOVEMENT,
      futureInwardStockMovement
    );
  }

  setIdleTimeCosts(idleTimeCosts: IdleTimeCosts) {
    this.idleTimeCosts$.next(idleTimeCosts);
    this.localStorageService.setItem(key.IDLETIMECOSTS, idleTimeCosts);
  }

  setWaitingListWorkstations(
    waitinglistworkstations: WorkplaceWaitingListWorkstation[]
  ) {
    this.waitinglistworkstations$.next(waitinglistworkstations);
    this.localStorageService.setItem(
      key.WAITINGLISTWORKSTATIONS,
      waitinglistworkstations
    );
  }

  setWaitingListStock(waitingListStock: MissingPart[]) {
    this.waitingListStock$.next(waitingListStock);
    this.localStorageService.setItem(key.WAITINGLISTSTOCK, waitingListStock);
  }

  setOrdersInWork(ordersInWork: OrderInWork[]) {
    this.ordersInWork$.next(ordersInWork);
    this.localStorageService.setItem(key.ORDERSINWORK, ordersInWork);
  }

  setCompletedOrders(completedOrders: CompletedOrder[]) {
    this.completedOrders$.next(completedOrders);
    this.localStorageService.setItem(key.COMPLETEDORDERS, completedOrders);
  }

  setCycleTimes(cycleTimes: Cycletimes) {
    this.cycleTimes$.next(cycleTimes);
    this.localStorageService.setItem(key.CYCLETIMES, cycleTimes);
  }

  setResults(result: Result) {
    this.result$.next(result);
    this.localStorageService.setItem(key.RESULT, result);
  }

  setForecasts(forecasts: Forecast[]) {
    this.forecasts$.next(forecasts);
    this.localStorageService.setItem(key.FORECASTS, forecasts);
    const mandatoryOrder = forecasts[0];
    this.mandatoryOrders$.next(mandatoryOrder);
    this.localStorageService.setItem(key.MANDATORYORDERS, mandatoryOrder);
  }

  setProduction(production: Production[]) {
    this.production$.next(production);
    this.localStorageService.setItem(key.PRODUCTION, production);
  }
}
