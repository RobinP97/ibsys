import { waitinglist } from './waitinglist';

export interface workplacewaitinglistworkstation
{
    id: number;
    timeneed: number;
    waitinglist: waitinglist[];
}
