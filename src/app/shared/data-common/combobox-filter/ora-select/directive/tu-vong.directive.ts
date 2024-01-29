import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { TU_VONG } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirTuVong]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: TuVongDirective
        }
    ]
})
export class TuVongDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    tuVong = TU_VONG;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.tuVong.TUVONG_CO, displayText: 'Có' },
            { value: this.tuVong.TUVONG_KHONG, displayText: 'Không' }
        ]);
    }
}
