export interface OrderPlanning {
  id: number;
  category: string;
  discountAmount: number;
  replacementTime: number;
  replacementTimeVariance: number;
  usage: number[];
  demand: number[];
  current_stock: number;
}
