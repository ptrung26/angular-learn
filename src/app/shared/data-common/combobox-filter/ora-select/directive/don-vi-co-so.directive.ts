import { Directive, Injector, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {
    DonViCoSoServiceProxy
} from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirDonViCoSo]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: DonViCoSoDirective
        }
    ]
})
export class DonViCoSoDirective extends AppComponentBase implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    arrDonViCoSo = [];
    constructor(
        injector: Injector,
        private _donViCoSoService: DonViCoSoServiceProxy
    ) {
        super(injector);
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        this._donViCoSoService.comboBoxIntData(0, '').subscribe(result => {
            result.forEach(item => {
                this.arrDonViCoSo.push({
                    value: item.value,
                    displayText: item.displayText
                });
            });
        });
        return of<ISelectOption[]>(this.arrDonViCoSo);
    }
}
