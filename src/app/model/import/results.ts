import { completedorders } from "./completedorders";
import { cycletimes } from "./cycletimes";
import { forecast } from "./forecast";
import { futureinwardstockmovement } from "./futureinwardstockmovement";
import { idletimecosts } from "./idletimecosts";
import { inwardstockmovement } from "./inwardstockmovement";
import { ordersinwork } from "./ordersinwork";
import { result } from "./result";
import { waitingliststock } from "./waitingliststock";
import { waitinglistworkstations } from "./waitinglistworkstations";
import { warehousestock } from "./warehousestock";

export interface Results
{
    game: number;
    group: number;
    period: number;
    forecasts: forecast;
    warehousestock: warehousestock;
    inwardstockmovement: inwardstockmovement;
    futureinwardstockmovement: futureinwardstockmovement;
    idletimecosts: idletimecosts;
    waitinglistworkstations: waitinglistworkstations;
    waitingliststock: waitingliststock;
    ordersinwork: ordersinwork;
    completedorders: completedorders;
    cycletimes: cycletimes;
    result: result;
}