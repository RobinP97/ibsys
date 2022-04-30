import { completedorders } from './completedorders';
import { cycletimes } from './cycletimes';
import { forecast } from './forecast';
import { futureinwardstockmovement } from './futureinwardstockmovement';
import { idletimecosts } from './idletimecosts';
import { inwardstockmovement } from './inwardstockmovement';
import { orderinwork } from './orderinwork';
import { result } from './result';
import { waitingliststock } from './waitingliststock';
import { waitinglistworkstations } from './waitinglistworkstations';
import { warehousestock } from './warehousestock';

export interface Results {
  game: number;
  group: number;
  period: number;
  forecasts: forecast;
  warehousestock: warehousestock;
  //Vorschlag ohne Zwischenklasse: inwardstockmovement[]
  inwardstockmovement: inwardstockmovement;
  //Vorschlag ohne Zwischenklasse: futureinwardstockmovement[]
  futureinwardstockmovement: futureinwardstockmovement;
  idletimecosts: idletimecosts;
  //Vorschlag ohne Zwischenklasse: workplacewaitinglistworkstation[]
  waitinglistworkstations: waitinglistworkstations;
  //Vorschlag ohne Zwischenklasse:  missingpart[]
  waitingliststock: waitingliststock;
  ordersinwork: orderinwork[];
  //Vorschlag ohne Zwischenklasse:  completedorder[]
  completedorders: completedorders;
  cycletimes: cycletimes;
  result: result;
}
