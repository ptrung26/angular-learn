import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'replaceSomeText'
})
export class ReplaceSomeTextPipe implements PipeTransform {

    transform(value: string): string {
        if (value) {
            value = value.replace('loại i', 'loại I');
            value = value.replace('loại Ii', 'loại II');
            value = value.replace('loại IIi', 'loại III');
            value = value.replace('nutifood', 'Nutifood');
        }
        return value;
    }

}
