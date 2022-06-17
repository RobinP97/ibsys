import { orderTypes } from './orderTypeEnum';

export interface OrderPlanning {
  differenceTillReplacedAndStockAfterAPeriod: number;
  id: number;
  category: string;
  discountAmount: number;
  replacementTime: number;
  replacementTimeVariance: number;
  replacementTimeAndVariance: number;
  neededTillReplaced: number;
  neededTillReplacedAfterAPeriod: number;
  usage: number[];
  demand: number[];
  current_stock: number;
  differenceTillReplacedAndStock: number;
  orderQuantity: number;
  orderType: orderTypes;
}
