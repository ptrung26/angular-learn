import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'stringToObj'
})
export class StringToObjPipe implements PipeTransform {

    transform(value: string, valueReturnIfNull = null): object {
        if (value) {
            return JSON.parse(value);
        } else {
            return valueReturnIfNull;
        }
    }

}
