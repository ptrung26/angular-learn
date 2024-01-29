import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { NHOM_XET_NGHIEM_NHIEU_LAN } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirNhomXetNghiemNhieuLan]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: NhomXetNghiemNhieuLanDirective
        }
    ]
})
export class NhomXetNghiemNhieuLanDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    nhomXetNghiemNhieuLan = NHOM_XET_NGHIEM_NHIEU_LAN;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.nhomXetNghiemNhieuLan.HCV_ARN, displayText: 'Tải lượng HCV ARN' },
            { value: this.nhomXetNghiemNhieuLan.HCV_Genotype, displayText: 'HCV Genotype' },
            { value: this.nhomXetNghiemNhieuLan.HBV_DNA, displayText: 'Tải lượng HBV DNA' }
        ]);
    }
}
