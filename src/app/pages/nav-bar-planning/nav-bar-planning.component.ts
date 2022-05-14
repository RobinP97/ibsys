import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatStepper } from '@angular/material/stepper';

@Component({
  templateUrl: './nav-bar-planning.component.html',
  styleUrls: ['./nav-bar-planning.component.scss'],
})
export class NavBarPlanningComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper | undefined;
  @ViewChildren(RouterOutlet) fooList: any;
  @ViewChildren('matStep') stepList: any;
  steps: any[] = [
    { title: 'import.title', index: 0, path: '' },
    { title: 'production.title', index: 1, path: 'forecast' },
    { title: 'Third', index: 2, path: 'production' },
  ];
  selectedStepIndex = 0;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

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
    console.log(url, this.steps);
    this.router.navigate([url]); //using -> private router: Router
  }
}
