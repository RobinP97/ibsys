import { Component, OnInit } from '@angular/core';
import { productionTime } from 'src/app/model/capacity/productionTime';
import { Workstation } from 'src/app/model/capacity/workstation';
import { Production } from 'src/app/model/production/production';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.component.html',
  styleUrls: ['./capacity.component.scss']
})
export class CapacityComponent implements OnInit {

  inhouse_parts: Production[];
  workstations: Workstation[];
  constructor(
    private readonly dataSerivce: DataService
    ) {
      this.inhouse_parts = dataSerivce.getProduction();
      this.workstations = [];
      for (let i = 1; i < 16; i++) {
        let workstation = {} as Workstation;
        workstation.id = i.toString();
        workstation.totalProductionTime = 0;
        workstation.totalSetUpTime = 0;
        workstation.totalTime = 0;
        workstation.productionTime = [];
        this.workstations.push(workstation);
      }
      this.inhouse_parts.forEach((inhouse_part) => {
        inhouse_part.processing_chain.forEach((processing_chain) => {
          let activeWorkstation = this.workstations.find(
            (workstation) => workstation.id == processing_chain.workstationId
          );
          let productionTime = {} as productionTime;
          productionTime.id = inhouse_part.id;
          productionTime.time = inhouse_part.planned_production * processing_chain.productionTime;
          activeWorkstation.totalProductionTime += productionTime.time;
          if(productionTime.time > 0)
          {
            activeWorkstation.totalSetUpTime += processing_chain.setUpTime;
          }
          activeWorkstation.totalTime = activeWorkstation.totalSetUpTime + activeWorkstation.totalProductionTime;
          activeWorkstation.productionTime.push(productionTime);
        });
      });
      console.log(this.workstations);
   }

   findWorkstationById(id: string): Workstation
   {
    return this.workstations.find(
      (workstation) => workstation.id == id
    );
   }

   findInhousePartById(id: number): Production
   { 
     return this.inhouse_parts.find(
    (inhouse_part) => inhouse_part.id == id
  );
   }

  ngOnInit(): void {

  }

}
