export interface cycletimes
{
    startedorders: number;
    waitingorders: number;
    order: {
        id: number;
        period: number;
        starttime: string;
        finishtime: string;
        cycletimemin: number;
        cycletimefactor: number;
    }[];
}
