import {Injector, Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';
import { CongThucDinhDuongService } from '@app/shared/common/pipes/cong-thuc-dinh-duong.service';

@Pipe({name: 'convertDd100g'})
export class ConvertDdFrom100gTpPipe implements PipeTransform {
    ctService: CongThucDinhDuongService;

    constructor(injector: Injector) {
        this.ctService = injector.get(CongThucDinhDuongService);
    }

    transform(hamLuongDinhDuong: number, khoiLuongTP: number, tyLeQuyDoi: number = 1,
              slPhanThapPhan: number = 2, type: 'type1' | 'type2' = 'type2'): any {
        const res = this.ctService.convertDinhDuongFrom100gThucPham(khoiLuongTP, hamLuongDinhDuong, tyLeQuyDoi);
        if (type === 'type1') {
            return _.round(res, slPhanThapPhan);
        } else {
            return res.toFixed(slPhanThapPhan);
        }
    }
}

