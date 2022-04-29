export interface ordersinwork {
  workplace?: {
    id: number;
    period: number;
    order: number;
    batch: number;
    item: number;
    amount: number;
    timeneed: number;
  }[];
}
