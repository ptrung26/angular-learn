import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'uppercaseFirstWord'
})
export class UppercaseFirstWordPipe implements PipeTransform {
//Viết hoa ký tự đầu tiên sau dấu cák
    transform(value: string): string {
        if (value) {
            const arrStr = value.toLocaleLowerCase().split(' ');
            const part2 = arrStr.map(item => {
                return this.capitalizeFirstLetter(item);
            }).join(' ');

            return part2.split('(').map(item => {
                return this.capitalizeFirstLetter(item);
            }).join('(');
        }
        return '';
        // return arrStr.join(' ');
        // const str = (value + '').toLowerCase();
        // return str.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        //     return $1.toUpperCase();
        // });

    }

    capitalizeFirstLetter(string: string) {
        return string[0] ? string[0].toUpperCase() + string.slice(1) : string;
    }

}
