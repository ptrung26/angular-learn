import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { NHOM_BENH } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirNhomBenh]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: NhomBenhDirective
        }
    ]
})
export class NhomBenhDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    nhomBenh = NHOM_BENH;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.nhomBenh.VIEM_GAN_B, displayText: 'Viêm gan B' },
            { value: this.nhomBenh.VIEM_GAN_C, displayText: 'Viêm gan C' }
        ]);
    }
}
