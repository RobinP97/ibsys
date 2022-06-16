import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { Production } from 'src/app/model/production/production';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Workstation } from 'src/app/model/capacity/workstation';
import { productionTime } from 'src/app/model/capacity/productionTime';

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.component.html',
  styleUrls: ['./capacity.component.scss'],
})
export class CapacityComponent implements OnInit {
  inhouse_parts: Production[];
  workstations: Workstation[];

  constructor(
    private readonly dataSerivce: DataService,
    private readonly snackBarService: SnackbarService
  ) {
    let waitinglistworkstations = dataSerivce.getWaitinglistWorkstations();
    this.inhouse_parts = dataSerivce.getProductionOrders();
    this.workstations = dataSerivce.getWorkStations();
    if (!this.workstations) this.initializeWorkstations();
    else {
      this.resetWorkstationTime();
    }

    const imported_parts = require('../../data/inhouse-parts.json');
    waitinglistworkstations.forEach((waitinglist) => {
      let activeWorkstation = this.findWorkstationById(
        waitinglist.id.toString()
      );
      activeWorkstation.capacityNeedDeficitPriorPeriod += waitinglist.timeneed;
      if (waitinglist.waitinglist !== undefined) {
        waitinglist.waitinglist.forEach((waitingListEntry) => {
          activeWorkstation.setUpTimeDeficitPriorPeriod += imported_parts
            .find((part) => part.partId == waitingListEntry.item)
            .processingChain.find(
              (chain) => chain.workstationId == activeWorkstation.id
            ).setUpTime;
        });
      }
    });

    this.inhouse_parts.forEach((inhouse_part) => {
      inhouse_part.processing_chain.forEach((processing_chain) => {
        let activeWorkstation = this.workstations.find(
          (workstation) => workstation.id == processing_chain.workstationId
        );
        let productionTime = {} as productionTime;
        productionTime.id = inhouse_part.id;
        productionTime.time =
          inhouse_part.planned_production * processing_chain.productionTime;
        activeWorkstation.totalProductionTime += productionTime.time;
        if (productionTime.time > 0) {
          activeWorkstation.totalSetUpTime += processing_chain.setUpTime;
        }
        activeWorkstation.capacityNeedDeficitPriorPeriod += 0;
        activeWorkstation.totalTime =
          activeWorkstation.totalSetUpTime +
          activeWorkstation.totalProductionTime +
          activeWorkstation.capacityNeedDeficitPriorPeriod +
          activeWorkstation.setUpTimeDeficitPriorPeriod;
        for (let i = activeWorkstation.totalTime; i > 3600; ) {
          activeWorkstation.shifts++;
          i -= 2400;
        }
        if (activeWorkstation.totalTime > 2400) {
          if (activeWorkstation.shifts * 2400 < activeWorkstation.totalTime) {
            activeWorkstation.overTime =
              activeWorkstation.totalTime - activeWorkstation.shifts * 2400;
          } else {
            activeWorkstation.overTime = 0;
          }
        }
        activeWorkstation.productionTime.push(productionTime);
        if (activeWorkstation.shifts > 3) {
          activeWorkstation.shifts = 3;
        }
        if (activeWorkstation.overTime > 1200) {
          activeWorkstation.overTime = 1200;
        }
      });
    });
    console.log(this.workstations);

    this.saveData();
  }
  
  resetWorkstationTime() {
    this.workstations.forEach((workstation) => {
      workstation.totalProductionTime = 0;
      workstation.totalSetUpTime = 0;
      workstation.totalTime = 0;
      workstation.overTime = 0;
      workstation.shifts = 1;
      workstation.setUpTimeDeficitPriorPeriod = 0;
      workstation.capacityNeedDeficitPriorPeriod = 0;
    })
  }

  initializeWorkstations() {
    this.workstations = [];
    for (let i = 1; i < 16; i++) {
      let workstation = {} as Workstation;
      workstation.id = i.toString();
      workstation.totalProductionTime = 0;
      workstation.totalSetUpTime = 0;
      workstation.totalTime = 0;
      workstation.productionTime = [];
      workstation.capacityNeedDeficitPriorPeriod = 0;
      workstation.setUpTimeDeficitPriorPeriod = 0;
      workstation.overTime = 0;
      workstation.shifts = 1;
      this.workstations.push(workstation);
    }
  }

  findWorkstationAndProductionTimeById(
    workstationId: string,
    productionTimeId: number
  ): productionTime {
    let activeWorkstation = this.workstations.find(
      (workstation) => workstation.id == workstationId
    );
    return activeWorkstation.productionTime.find(
      (productionTime) => productionTime.id == productionTimeId
    );
  }

  findWorkstationById(workstationId: string): Workstation {
    return this.workstations.find(
      (workstation) => workstation.id == workstationId
    );
  }

  findInhousePartById(id: number): Production {
    return this.inhouse_parts.find((inhouse_part) => inhouse_part.id == id);
  }

  ngOnInit(): void {}

  onChangeWorkstation(workstation: Workstation) {
    if (
      workstation.shifts < 1 ||
      typeof workstation.shifts == undefined ||
      isNaN(workstation.shifts) ||
      workstation.shifts == null ||
      workstation.shifts > 3
    ) {
      this.triggerWarningForNonValidShiftNumber();
      workstation.shifts = 1;
    }
    this.saveData();
  }

  onChangeWorkstationOvertime(workstation: Workstation) {
    if (
      workstation.overTime < 0 ||
      typeof workstation.overTime == undefined ||
      isNaN(workstation.overTime) ||
      workstation.overTime == null ||
      workstation.overTime > 1200
    ) {
      this.triggerWarningForNonValidOvertimeNumber();
      workstation.overTime = 0;
    }
    this.saveData();
  }

  triggerWarningForNonValidShiftNumber() {
    this.snackBarService.openSnackBar(
      'capacity.error.NonValidShiftNumber',
      'Ok',
      10000
    );
  }

  triggerWarningForNonValidOvertimeNumber() {
    this.snackBarService.openSnackBar(
      'capacity.error.NonValidOvertimeNumber',
      'Ok',
      10000
    );
  }

  getTotalCapaReqTooltip(workstation) {
    if (workstation.id === '5') return '';
    return `${workstation.totalProductionTime} + ${workstation.totalSetUpTime} + ${workstation.capacityNeedDeficitPriorPeriod} + ${workstation.setUpTimeDeficitPriorPeriod} = ${workstation.totalTime}`;
  }

  saveData() {
    this.dataSerivce.setWorkstations(this.workstations);
  }
}
