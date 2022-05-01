export interface Cycletimes {
  startedorders: number;
  waitingorders: number;
  // Vorschlag: Separates interface
  order: {
    id: number;
    period: number;
    starttime: string;
    finishtime: string;
    cycletimemin: number;
    cycletimefactor: number;
  }[];
}
