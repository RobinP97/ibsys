import { CompletedOrder } from '../model/import/completedorder';
import { Cycletimes } from '../model/import/cycletimes';
import { Forecast } from '../model/import/forecast';
import { IdleTimeCosts } from '../model/import/idletimecosts';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { MissingPart } from '../model/import/missingpart';
import { OrderInWork } from '../model/import/orderinwork';
import { OrderInwardStockMovement } from '../model/import/orderinwardstockmovement';
import { Result } from '../model/import/result';
import { Subject } from 'rxjs';
import { WarehouseStock } from '../model/import/warehousestock';
import { WorkplaceWaitingListWorkstation } from '../model/import/workplaceWaitingListWorkstations';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  game$ = new Subject<number>();
  group$ = new Subject<number>();
  period$ = new Subject<number>();

  forecast$ = new Subject<Forecast>();
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

  //... und weitere die wir brauchen
  // Mit Subjects können wir einer Menge an Abonnenten Änderungen an relevanten Daten mitteilen
  // Die Abonnenten können kann die Daten z.B. mit der Async-Pipe darstellen

  constructor(private readonly localStorageService: LocalStorageService) {}

  //-------------------------------------------------------------------------------------------
  // get-Methoden: Holen Daten aus dem Browerchache
  //-------------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------------
  // get-Methoden: Schreibe Daten in den Browerchache und informiere die relevanten Abonnenten
  //-------------------------------------------------------------------------------------------
  setGame(game: number) {
    this.game$.next(game);
    this.localStorageService.setItem('game', game);
  }

  setPeriod(period: number) {
    this.period$.next(period);
    this.localStorageService.setItem('period', period);
  }

  setGroup(group: number) {
    this.period$.next(group);
    this.localStorageService.setItem('group', group);
  }

  setForecast(forecast: Forecast) {
    this.forecast$.next(forecast);
    this.localStorageService.setItem('forecast', forecast);
  }

  setWarehouseStock(warehouseStock: WarehouseStock) {
    this.warehouseStock$.next(warehouseStock);
    this.localStorageService.setItem('warehousestock', warehouseStock);
  }

  setInwardStockMovement(inwardStockMovement: OrderInwardStockMovement[]) {
    this.inwardStockMovement$.next(inwardStockMovement);
    this.localStorageService.setItem(
      'inwardstockmovement',
      inwardStockMovement
    );
  }

  setFutureInwardStockMovement(
    futureInwardStockMovement: OrderInwardStockMovement[]
  ) {
    this.futureInwardStockMovement$.next(futureInwardStockMovement);
    this.localStorageService.setItem(
      'futureinwardstockmovement',
      futureInwardStockMovement
    );
  }

  setIdleTimeCosts(idleTimeCosts: IdleTimeCosts) {
    this.idleTimeCosts$.next(idleTimeCosts);
    this.localStorageService.setItem('idletimecosts', idleTimeCosts);
  }

  setWaitingListWorkstations(
    waitinglistworkstations: WorkplaceWaitingListWorkstation[]
  ) {
    this.waitinglistworkstations$.next(waitinglistworkstations);
    this.localStorageService.setItem(
      'waitinglistworkstations',
      waitinglistworkstations
    );
  }

  setWaitingListStock(waitingListStock: MissingPart[]) {
    this.waitingListStock$.next(waitingListStock);
    this.localStorageService.setItem('waitingliststock', waitingListStock);
  }

  setOrdersInWork(ordersInWork: OrderInWork[]) {
    this.ordersInWork$.next(ordersInWork);
    this.localStorageService.setItem('ordersinwork', ordersInWork);
  }

  setCompletedOrders(completedOrders: CompletedOrder[]) {
    this.completedOrders$.next(completedOrders);
    this.localStorageService.setItem('completedorders', completedOrders);
  }

  setCycleTimes(cycleTimes: Cycletimes) {
    this.cycleTimes$.next(cycleTimes);
    this.localStorageService.setItem('cycletimes', cycleTimes);
  }

  setResults(result: Result) {
    this.result$.next(result);
    this.localStorageService.setItem('result', result);
  }
}
