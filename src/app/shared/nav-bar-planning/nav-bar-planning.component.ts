import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { DataService } from 'src/app/service/data.service';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { STEPS } from '../production-planning-steps';
import { Step } from 'src/app/model/production/step';

@Component({
  templateUrl: './nav-bar-planning.component.html',
  styleUrls: ['./nav-bar-planning.component.scss'],
})
export class NavBarPlanningComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  @ViewChild('stepper') stepper: MatStepper | undefined;
  // @ViewChildren(RouterOutlet) fooList: any;
  @ViewChildren('matStep') stepList: any;
  steps: Step[];

  selectedStepIndex = 0;
  completedImport: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.steps = STEPS;
    this.dataService.fileUploadSuccessful$.subscribe({
      next: (success) => (this.completedImport = success),
    });

    this.dataService.completedProductionPlanningStep$.subscribe({
      next: (step) => {
        if (this.stepList)
          this.stepList._results[step.index]._completedOverride =
            step.completed;
      },
    });
  }

  ngAfterContentInit(): void {
    this.dataService.importFileStatus(
      this.dataService.checkBrowsercache4ImportedFileData()
    );
  }

  // ngAfterViewInit() {
  //   this.stepList.changes.subscribe((t: any) => {
  //     this.ngForRendred();
  //   });
  // }

  // ngForRendred() {
  //   console.log('NgFor is Rendered', this.fooList);
  // }

  // move(index: number) {
  //   if (this.stepper) {
  //     this.stepper.selectedIndex = index;
  //   }
  // }
  // next() {
  //   if (this.stepper) {
  //     const currentIndex = this.stepper?.selectedIndex;
  //     const nextStep = !!this.steps ? 0 : this.steps[currentIndex + 1];
  //     this.stepper.selectedIndex = currentIndex + 1;
  //   }
  // }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dataService.fileUploadSuccessful$.complete();
    this.dataService.completedProductionPlanningStep$.complete();
  }
  selectionChanged(event: any) {
    this.selectedStepIndex = event.selectedIndex;
    const url = 'planning/' + this.steps[this.selectedStepIndex].path;
    this.router.navigate([url]);
  }
}
