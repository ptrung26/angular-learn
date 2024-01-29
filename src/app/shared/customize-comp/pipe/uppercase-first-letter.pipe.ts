import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'uppercaseFirstLetter'
})
export class UppercaseFirstLetterPipe implements PipeTransform {
//Viết hoa ký tự đầu tiên của đoạn văn
    transform(value: string): string {
        return value ? value.charAt(0).toUpperCase() + value.toLocaleLowerCase().slice(1) : '';
    }
}
