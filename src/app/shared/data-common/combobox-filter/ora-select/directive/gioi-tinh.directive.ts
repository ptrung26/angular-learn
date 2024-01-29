import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { GIOI_TINH } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirGioiTinh]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: GioiTinhDirective
        }
    ]
})
export class GioiTinhDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    gioiTinh = GIOI_TINH;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.gioiTinh.NAM, displayText: 'Nam' },
            { value: this.gioiTinh.NU, displayText: 'Nữ' }
        ]);
    }
}
