import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'percent'
})
export class PercentPipe implements PipeTransform {
    transform(base: any): any {
        console.log(base)
        return base ? `${base}%`:base
    }
}