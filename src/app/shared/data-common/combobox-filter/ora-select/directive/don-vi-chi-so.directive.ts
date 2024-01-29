import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { DON_VI_CHI_SO } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirDonViChiSo]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: DonViChiSoDirective
        }
    ]
})
export class DonViChiSoDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    donViChiSo = DON_VI_CHI_SO;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.donViChiSo.UL, displayText: 'U/L' },
            { value: this.donViChiSo.KUL, displayText: 'K/UL' },
            { value: this.donViChiSo.GL, displayText: 'G/L' },
            { value: this.donViChiSo.L109, displayText: '10^9/L' }
        ]);
    }
}
