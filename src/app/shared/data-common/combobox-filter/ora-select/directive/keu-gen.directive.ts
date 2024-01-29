import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { KIEU_GEN } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirKieuGen]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: KieuGenDirective
        }
    ]
})
export class KieuGenDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    kieuGen = KIEU_GEN;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.kieuGen.GEN_1, displayText: '1' },
            { value: this.kieuGen.GEN_2, displayText: '2' },
            { value: this.kieuGen.GEN_3, displayText: '3' },
            { value: this.kieuGen.GEN_4, displayText: '4' },
            { value: this.kieuGen.GEN_5, displayText: '5' },
            { value: this.kieuGen.GEN_6, displayText: '6' },
        ]);
    }
}
