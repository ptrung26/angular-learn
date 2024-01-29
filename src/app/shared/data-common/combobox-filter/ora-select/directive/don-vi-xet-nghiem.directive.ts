import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { DON_VI_XET_NGHIEM } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirDonViXetNghiem]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: DonViXetNghiemDirective
        }
    ]
})
export class DonViXetNghiemDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    donViXetNghiem = DON_VI_XET_NGHIEM;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.donViXetNghiem.IU, displayText: 'IU/ml' },
            { value: this.donViXetNghiem.COPIES, displayText: 'Copies/ml' }
        ]);
    }
}
