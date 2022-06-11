import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
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
import { Observable } from 'rxjs/internal/Observable';
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
  // @ViewChildren(RouterOutlet) fooList: any;
  @ViewChildren('matStep') stepList: any;
  steps: Step[];

  selectedStepIndex = 0;
  completedImport: boolean = false;
  route: ActivatedRouteSnapshot;
  exitWarning: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly snackBarService: SnackbarService,
    public dialog: MatDialog
  ) {
    this.completedImport = dataService.checkBrowsercache4ImportedFileData();
  }

  // openDialog(): void {
  
  // }

  canExit() {
    const dialogRef = this.dialog.open(ExitWarningDialogComponent, {
      width: '250px',
    });
    return dialogRef.afterClosed().toPromise();
  }



  ngOnInit(): void {
    this.steps = STEPS;
    this.dataService.fileUploadSuccessful$.subscribe({
      next: (success) => (this.completedImport = success),
    });

  //   this.dataService.completedProductionPlanningStep$.subscribe({
  //     next: (step) => {
  //       // console.log('nav-bar', step);
  //       if (this.stepList) {
  //         // console.log('nav-bar', this.stepList._results[step.index]);

  //         this.stepList._results[step.index]._completedOverride =
  //           step.completed;
  //         // Eine Datei erfolgreich hochgeladen wurde editable auf false setzen
  //         if (step.index === 0)
  //           this.stepList._results[step.index]._editable = !step.completed;
  //       }
  //     },
  //   });
  }

  ngAfterContentInit() {
    if (this.completedImport) {
      // Match: Path to stepper index
      const currentUrlParts = this.router.url.split('/');
      const lastUrlPart =
        currentUrlParts.length > 2
          ? currentUrlParts[currentUrlParts.length - 1]
          : '';
      for (let step of this.steps) {
        if (this.stepList) this.stepList._results[step.index].interacted = true;
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
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.stepList._results
      .filter((step, idx) => idx < this.selectedStepIndex)
      .forEach((step) => (step.interacted = true));
    this.dataService.importFileStatus(this.completedImport);
    this.navigateToPlanningStep();
  }

  ngOnDestroy(): void {
    this.dataService.fileUploadSuccessful$.complete();
    this.dataService.completedProductionPlanningStep$.complete();
  }

  selectionChanged(event: any) {
    this.selectedStepIndex = event.selectedIndex;
    this.navigateToPlanningStep();
    // const url = 'planning/' + this.steps[this.selectedStepIndex].path;
    // this.router.navigate([url]);
  }

  navigateToPlanningStep() {
    const url =
      this.selectedStepIndex === 0
        ? 'planning'
        : 'planning/' + this.steps[this.selectedStepIndex].path;
    this.router.navigate([url]);
  }
}
