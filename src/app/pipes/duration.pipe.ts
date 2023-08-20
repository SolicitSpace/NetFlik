import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (!value) return "";
    // Only minutes
    if (value > 0 && value / 60 < 1) return value + 'm';
    else {
      let hr = Math.floor(value / 60);
      let mn = value % 60;
      return hr + 'h' + ((mn > 0) ? mn.toString().slice(0,2) + 'm' : "");
    }
  }
}
