import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { KET_QUA_XET_NGHIEM } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirAllKetQuaXetNghiem]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: AllKetQuaXetNghiemDirective
        }
    ]
})
export class AllKetQuaXetNghiemDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    ketQuaXetNghiem = KET_QUA_XET_NGHIEM;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.ketQuaXetNghiem.KHONG_XN, displayText: 'Không XN' },
            { value: this.ketQuaXetNghiem.AM_TINH, displayText: 'Âm tính' },
            { value: this.ketQuaXetNghiem.DUONG_TINH, displayText: 'Dương tính' }
        ]);
    }
}
