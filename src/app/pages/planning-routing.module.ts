import { RouterModule, Routes } from '@angular/router';

import { CapacityComponent } from './capacity/capacity.component';
import { DeactivateGuardService } from '../service/deactivate-guard.service';
import { DirectsalesComponent } from './directsales/directsales.component';
import { ExportComponent } from './export/export.component';
import { ForecastComponent } from './forecast/forecast.component';
import { ImportComponent } from './import/import.component';
import { NavBarPlanningComponent } from '../shared/nav-bar-planning/nav-bar-planning.component';
import { NgModule } from '@angular/core';
import { OrderPlanningComponent } from './order-planning/order-planning.component';
import { ProductionComponent } from './production/production.component';
import { SequencePlanningComponent } from './sequence-planning/sequence-planning.component';

// const routes: Routes = [
//   { path: '', component: ImportComponent },
//   { path: 'forecast', component: ForecastComponent },
//   { path: 'directsales', component: DirectsalesComponent },
//   { path: 'production', component: ProductionComponent },
//   { path: 'order-planning', component: OrderPlanningComponent },
//   { path: 'sequencePlanning', component: SequencePlanningComponent },
//   { path: 'orderPlanning', component: OrderPlanningComponent },
//   { path: 'capacity', component: CapacityComponent },
//   { path: 'export', component: ExportComponent },
// ];

const routes: Routes = [
  {
    path: '',
    component: NavBarPlanningComponent,
    canDeactivate: [DeactivateGuardService],
    children: [
      { path: '', component: ImportComponent },
      { path: 'forecast', component: ForecastComponent },
      { path: 'directsales', component: DirectsalesComponent },
      { path: 'production', component: ProductionComponent },
      { path: 'order-planning', component: OrderPlanningComponent },
      { path: 'sequencePlanning', component: SequencePlanningComponent },
      { path: 'orderPlanning', component: OrderPlanningComponent },
      { path: 'capacity', component: CapacityComponent },
      { path: 'export', component: ExportComponent },
    ],
  },
  { path: '**', pathMatch: 'full', component: NavBarPlanningComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningRoutingModule {}
