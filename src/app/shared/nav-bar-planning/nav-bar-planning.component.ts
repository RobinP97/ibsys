import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatStepper } from '@angular/material/stepper';
import { STEPS } from '../production-planning-steps';
import { Step } from 'src/app/model/production/step';

@Component({
  templateUrl: './nav-bar-planning.component.html',
  styleUrls: ['./nav-bar-planning.component.scss'],
})
export class NavBarPlanningComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper | undefined;
  @ViewChildren(RouterOutlet) fooList: any;
  @ViewChildren('matStep') stepList: any;
  steps: Step[];

  selectedStepIndex = 0;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.steps = STEPS;
  }

  move(index: number) {
    if (this.stepper) {
      console.log('move');
      this.stepper.selectedIndex = index;
    }
  }
  next() {
    if (this.stepper) {
      const currentIndex = this.stepper?.selectedIndex;
      const nextStep = !!this.steps ? 0 : this.steps[currentIndex + 1];
      this.stepper.selectedIndex = currentIndex + 1;
    }
  }
  selectionChanged(event: any) {
    this.selectedStepIndex = event.selectedIndex;
    const url = 'planning/' + this.steps[this.selectedStepIndex].path;
    // console.log(url, this.steps);
    this.router.navigate([url]);
  }
}
