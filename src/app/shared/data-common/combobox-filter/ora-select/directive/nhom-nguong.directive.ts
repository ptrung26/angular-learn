import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { NHOM_NGUONG } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirNhomNguong]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: NhomNguongDirective
        }
    ]
})
export class NhomNguongDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    nhomNguong = NHOM_NGUONG;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.nhomNguong.TREN_NGUONG, displayText: 'Trên ngưỡng' },
            { value: this.nhomNguong.DUOI_NGUONG, displayText: 'Dưới ngưỡng' }
        ]);
    }
}
