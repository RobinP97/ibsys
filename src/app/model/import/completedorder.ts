export interface completedorder {
  period: number;
  id: number;
  item: number;
  quantity: number;
  cost: number;
  averageunitcosts: number;
  // Vorschlag: separates interface
  batch: {
    id: number;
    amount: number;
    cycletime: number;
    cost: number;
  }[];
}
