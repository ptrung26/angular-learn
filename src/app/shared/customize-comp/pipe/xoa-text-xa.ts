import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xoaTextXa'})
export class XoaTextXaPipe implements PipeTransform {
    transform(value: string, isDelete: boolean = true) {
        if (isDelete) {
            let res = value.replace('Xã ', '');
            res = res.replace('Phường ', '');
            return res;
        } else {
            return value;
        }
    }
}
