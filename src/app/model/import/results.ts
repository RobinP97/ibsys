import { CompletedOrder } from './completedorder';
import { Cycletimes } from './cycletimes';
import { Forecast } from './forecast';
import { IdleTimeCosts } from './idletimecosts';
import { MissingPart } from './missingpart';
import { OrderInWork } from './orderinwork';
import { OrderInwardStockMovement } from './orderinwardstockmovement';
import { Result } from './result';
import { WarehouseStock } from './warehousestock';
import { WorkplaceWaitingListWorkstation } from './workplaceWaitingListWorkstations';

export interface Results {
  game: number;
  group: number;
  period: number;
  forecast: Forecast;
  warehousestock: WarehouseStock;
  inwardstockmovement: OrderInwardStockMovement[];
  futureinwardstockmovement: OrderInwardStockMovement[];
  idletimecosts: IdleTimeCosts;
  waitinglistworkstations: WorkplaceWaitingListWorkstation[];
  waitingliststock: MissingPart[];
  ordersinwork: OrderInWork[];
  completedorders: CompletedOrder[];
  cycletimes: Cycletimes;
  result: Result;
}
