import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { NHIEM_HIV } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirNhiemHIV]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: NhiemHIVDirective
        }
    ]
})
export class NhiemHIVDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    nhiemHIV = NHIEM_HIV;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.nhiemHIV.NHIEMHIV_CO, displayText: 'Có' },
            { value: this.nhiemHIV.NHIEMHIV_KHONG, displayText: 'Không' }
        ]);
    }
}
