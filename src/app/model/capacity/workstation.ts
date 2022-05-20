import { productionTime } from "./productionTime";

export interface Workstation{
id: string;
productionTime: productionTime[];
totalSetUpTime: number;
totalProductionTime: number;
totalTime: number;
}