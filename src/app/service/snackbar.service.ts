import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SnackbarService {
  constructor(
    private readonly translateService: TranslateService,
    private readonly _snackBar: MatSnackBar
  ) {}

  openSnackBar(
    message: string,
    label: string = 'Ok',
    duration: number = 5000,
    messageAddon?: string
  ) {
    this._snackBar.open(
      this.translateService.instant(message) +
        (messageAddon ? messageAddon : ''),
      label,
      {
        duration,
      }
    );
  }
}
