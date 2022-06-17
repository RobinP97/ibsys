import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CapacityComponent } from './capacity/capacity.component';
import { DataService } from '../service/data.service';
import { DeactivateGuardService } from '../service/deactivate-guard.service';
import { DirectsalesComponent } from './directsales/directsales.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ExitWarningDialogComponent } from '../shared/exit-warning-dialog/exit-warning-dialog.component';
import { ExportComponent } from './export/export.component';
import { ForecastComponent } from './forecast/forecast.component';
import { ImportComponent } from './import/import.component';
import { IoService } from '../service/io.service';
import { LocalStorageService } from '../service/local-storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
// import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavBarPlanningComponent } from '../shared/nav-bar-planning/nav-bar-planning.component';
// import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
// import { NavBarPlanningComponent } from '../shared/nav-bar-planning/nav-bar-planning.component';
import { NgModule } from '@angular/core';
import { OrderPlanningComponent } from './order-planning/order-planning.component';
import { PlanningRoutingModule } from './planning-routing.module';
import { ProductionComponent } from './production/production.component';
import { SequencePlanningComponent } from './sequence-planning/sequence-planning.component';
import { SharedModule } from '../shared/shared.module';
import { SnackbarService } from '../service/snackbar.service';
import { ValidationService } from '../service/validation.service';

@NgModule({
  declarations: [
    ImportComponent,
    ExportComponent,
    ForecastComponent,
    ProductionComponent,
    NavBarPlanningComponent,
    OrderPlanningComponent,
    SequencePlanningComponent,
    DirectsalesComponent,
    CapacityComponent,
    ExitWarningDialogComponent,
  ],
  imports: [
    SharedModule,
    PlanningRoutingModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    CdkStepperModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatTableModule,
    MatToolbarModule,
  ],
  providers: [
    { provide: CdkStepper, useClass: NavBarPlanningComponent },
    { provide: SnackbarService, useClass: SnackbarService },
    { provide: ValidationService, useClass: ValidationService },
    { provide: DataService, useClass: DataService },
    { provide: LocalStorageService, useClass: LocalStorageService },
    { provide: DeactivateGuardService, useClass: DeactivateGuardService },
    { provide: IoService, useClass: IoService },
  ],
})
export class PlanningModule {}
