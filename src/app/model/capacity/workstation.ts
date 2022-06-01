import { productionTime } from "./productionTime";

export interface Workstation{
id: string;
productionTime: productionTime[];
totalSetUpTime: number;
totalProductionTime: number;
totalTime: number; 
capacityNeedDeficitPriorPeriod: number;
setUpTimeDeficitPriorPeriod : number;
shifts: number;
overTime: number;
}