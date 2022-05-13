import { WaitingListEntry } from './waitinglist';

export interface WorkplaceWaitingListWorkstation {
  id: number;
  timeneed: number;
  waitinglist: WaitingListEntry[];
}
