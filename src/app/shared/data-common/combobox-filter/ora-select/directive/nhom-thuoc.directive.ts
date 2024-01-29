import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { NHOM_THUOC } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirNhomThuoc]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: NhomThuocDirective
        }
    ]
})
export class NhomThuocDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    nhomThuoc = NHOM_THUOC;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.nhomThuoc.VIEM_GAN_B, displayText: 'Thuốc Viêm gan B' },
            { value: this.nhomThuoc.VIEM_GAN_C, displayText: 'Thuốc Viêm gan C' }
        ]);
    }
}
