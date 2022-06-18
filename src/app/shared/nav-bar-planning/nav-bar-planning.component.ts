import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { ExitWarningDialogComponent } from '../exit-warning-dialog/exit-warning-dialog.component';
import { IDeactivateComponent } from 'src/app/service/deactivate-guard.service';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { STEPS } from '../production-planning-steps';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Step } from 'src/app/model/production/step';

@Component({
  templateUrl: './nav-bar-planning.component.html',
  styleUrls: ['./nav-bar-planning.component.scss'],
})
export class NavBarPlanningComponent
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    OnDestroy,
    IDeactivateComponent
{
  @ViewChild('stepper') stepper: MatStepper | undefined;
  @ViewChildren('matStep') stepList: any;
  steps: Step[];

  selectedStepIndex = 0;
  completedImport: boolean = false;
  isLinear: boolean = true;
  exitWarning: boolean = false;
  lastStepCompleted: number;

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly snackBarService: SnackbarService,
    public dialog: MatDialog
  ) {
    this.completedImport = dataService.checkBrowsercache4ImportedFileData();
    console.log(this.completedImport);

    this.lastStepCompleted = dataService.getLastCompletedStep();
  }

  ngOnInit(): void {
    this.steps = STEPS;
    this.dataService.fileUploadSuccessful$.subscribe({
      next: (success) => {
        this.completedImport = success;
        this.stepList._results[0].completed = success;
      },
    });
  }

  ngAfterContentInit() {
    console.log('TEST', this.completedImport, this.lastStepCompleted);

    if (this.completedImport && this.lastStepCompleted) {
      // Match: Path to stepper index
      const currentUrlParts = this.router.url.split('/');
      const lastUrlPart =
        currentUrlParts.length > 2
          ? currentUrlParts[currentUrlParts.length - 1]
          : '';
      for (let step of this.steps) {
        // Zugriff nur auf abgeschlossene Tabs mit Index lastStepCompleted + 1
        if (step.index > this.lastStepCompleted + 1) {
          this.selectedStepIndex = this.lastStepCompleted + 1;
          break;
        }
        if (step.path !== lastUrlPart) continue;
        // this.stepper.selectedIndex = step.index;
        this.selectedStepIndex = step.index;
        // Info falls noch Daten aus der alten Planung im Browser zur Verfügung stehen
        if (step.index === 0) {
          this.snackBarService.openSnackBar(
            'import.importedDataAvailable_hint',
            'Ok',
            10000
          );
        }
        break;
      }
    }
  }

  ngAfterViewInit(): void {
    // Schritte markieren, die der Nutzer in einer linearen Abfolge schon erledigt hat
    // Reload bei Schritt 5: Schritte 0-4 müssen die property interacted = true setzen
    this.stepList._results
      .filter((step, idx) => idx < this.selectedStepIndex)
      .forEach((step) => (step.interacted = true));
    this.dataService.importFileStatus(this.completedImport);
    // console.log(this.stepList._results[0].completed);
    this.navigateToPlanningStep();
  }

  ngOnDestroy(): void {
    // this.dataService.fileUploadSuccessful$.complete();
    this.dataService.completedProductionPlanningStep$.complete();
  }

  canExit() {
    const dialogRef = this.dialog.open(ExitWarningDialogComponent, {
      width: '250px',
    });
    return dialogRef.afterClosed().toPromise();
  }

  selectionChanged(event: any) {
    console.log('TEST');

    this.selectedStepIndex = event.selectedIndex;
    this.lastStepCompleted = this.dataService.getLastCompletedStep();
    if (!this.lastStepCompleted) {
      this.lastStepCompleted = Math.max(this.selectedStepIndex - 1, 0);
    } else if (this.selectedStepIndex - 1 > this.lastStepCompleted) {
      this.lastStepCompleted = this.selectedStepIndex - 1;
    }
    this.dataService.setLastCompletedStep(this.selectedStepIndex - 1);

    this.navigateToPlanningStep();
  }

  navigateToPlanningStep() {
    if (this.selectedStepIndex === 0) this.router.navigate(['planning']);
    else
      this.router.navigate([
        'planning',
        this.steps[this.selectedStepIndex].path,
      ]);
  }

  saveCompletedStep(index: number) {
    this.dataService.setLastCompletedStep(index);
  }
}
