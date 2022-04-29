import { workplaceidletimecosts } from './workplaceidletimecosts';

export interface idletimecosts {
  workplace: workplaceidletimecosts[];
  sum: {
    setupevents: number;
    idletime: number;
    wageidletimecosts: number;
    wagecosts: number;
    machineidletimecosts: number;
  };
}
