import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xoaTextHuyen'})
export class XoaTextHuyenPipe implements PipeTransform {
    transform(value: string, isDelete: boolean = true) {
        if (isDelete) {
            let res = value.replace('Huyện ', '');
            res = res.replace('Quận ', '');
            return res;
        }
        return value;

    }
}
