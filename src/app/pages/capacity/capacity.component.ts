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
      dataSerivce.production$.subscribe({
        next: (v) => (this.inhouse_parts = v),
      });
      this.workstations = [];
      console.log("d");
      console.log(this.inhouse_parts);

   }

  ngOnInit(): void {

  }

}
