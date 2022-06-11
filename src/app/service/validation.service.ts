import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private readonly snackBarService: SnackbarService) {}

  //------------------------------------
  // Validator-Functions
  //------------------------------------

  returnValidNumber(
    num2Validate: number,
    oldNumber: number,
    errorMsg: string = 'error.NonValidNumber'
  ) {
    if (
      num2Validate < 0 ||
      typeof num2Validate == undefined ||
      isNaN(num2Validate) ||
      num2Validate == null
    ) {
      this.triggerWarningForNonValidNumber(errorMsg);
      return oldNumber;
    }
    return num2Validate;
  }

  returnMultipleOfTen(
    num2Validate: number,
    oldNumber: number,
    errorMsg: string = 'error.NonMultipleOfTen'
  ) {
    if (num2Validate % 10 !== 0) {
      this.triggerWarningForNonMultipleOfTen(errorMsg);
      return oldNumber;
    }
    return num2Validate;
  }

  returnGreaterThanMaxValue(
    num2Validate: number,
    oldNumber: number,
    max: number,
    errorMsg: string = 'error.GreaterThanMaxValue'
  ) {
    if (num2Validate > max) {
      this.triggerWarningForGreaterThanMaxValue(errorMsg, max);
      return oldNumber;
    }
    return num2Validate;
  }

  //------------------------------------
  // Messaging-Functions
  //------------------------------------

  triggerWarningForNonMultipleOfTen(errorMsg: string) {
    this.snackBarService.openSnackBar(errorMsg, 'Ok', 5000);
  }

  triggerWarningForNonValidNumber(errorMsg: string) {
    this.snackBarService.openSnackBar(errorMsg, 'Ok', 5000);
  }

  triggerWarningForGreaterThanMaxValue(errorMsg: string, max: number) {
    this.snackBarService.openSnackBar(errorMsg, 'Ok', 5000, max.toString());
  }
}
