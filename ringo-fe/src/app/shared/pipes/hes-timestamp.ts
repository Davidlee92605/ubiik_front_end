import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({name: 'hesdate'})
export class HESDate implements PipeTransform {
  // tslint:disable-next-line:no-any
  transform(value: any): string | null {
    const dp = new DatePipe('en-US');
    return dp.transform(value, 'yyyy-MM-dd HH:mm:ss');
  }
}
