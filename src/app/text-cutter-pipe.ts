import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCutter',
})
export class TextCutterPipe implements PipeTransform {
  transform(value: string, limiter: number): string {
    if (value.length > limiter) return `${value.slice(0, limiter)}...`;
    return value;
  }
}
