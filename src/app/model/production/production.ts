import { Split } from './split';

export interface Production {
  id: number;
  category: string;
  binding_orders: number;
  planned_stock: number;
  current_stock: number;
  in_queue: number;
  in_process: number;
  planned_production: number;
  elements: number[];
  predecessor_waiting_list: number;
  sequencePos: number;
  splits: Split[];
}
