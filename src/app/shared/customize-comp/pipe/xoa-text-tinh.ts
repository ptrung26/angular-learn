import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xoaTextTinh'})
export class XoaTextTinhPipe implements PipeTransform {
    transform(value: string, isDelete: boolean = true) {
        if (isDelete) {
            let res = value.replace('Tỉnh ', '');
            res = res.replace('Thành phố ', '');
            return res;
        } else {
            return value;
        }

    }
}
