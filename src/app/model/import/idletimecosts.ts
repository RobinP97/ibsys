import { WorkplaceIdletimeCosts } from './workplaceidletimecosts';

export interface IdleTimeCosts {
  workplace: WorkplaceIdletimeCosts[];
  sum: {
    setupevents: number;
    idletime: number;
    wageidletimecosts: number;
    wagecosts: number;
    machineidletimecosts: number;
  };
}
