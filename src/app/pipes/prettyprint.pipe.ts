import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyprint',
})
export class PrettyPrintPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value) {
      return JSON.stringify(value, null, 2)
        .replace(/ /g, '&nbsp;') // note the usage of `/ /g` instead of `' '` in order to replace all occurences
        .replace(/\n/g, '<br/>'); // same here
    } else return value;
  }
}
