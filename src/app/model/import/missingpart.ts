import { waitinglistworkstations } from "./waitinglistworkstations";
import { workplacewaitinglistworkstation } from "./workplaceWaitingListWorkstations";

export interface missingpart
{
    id: number;
    workplace: workplacewaitinglistworkstation;
}