export interface orderinwardstockmovement
{
    orderperiod: number;
    id: number;
    mode: number;
    article: number;
    amount: number;
    time?: number;
    materialcosts?: number;
    ordercosts?: number;
    entirecosts?: number;
    piececosts?: number;
}
