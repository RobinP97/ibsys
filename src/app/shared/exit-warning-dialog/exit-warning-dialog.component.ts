import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exit-warning-dialog',
  templateUrl: './exit-warning-dialog.component.html',
  styleUrls: ['./exit-warning-dialog.component.scss'],
})
export class ExitWarningDialogComponent {
  constructor(public dialogRef: MatDialogRef<ExitWarningDialogComponent>) {}
}
