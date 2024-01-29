import {Directive, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap, map} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { USER_LEVEL } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirAllUserLevel]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: AllUserLevelDirective
        }
    ]
})
export class AllUserLevelDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    userLevel=USER_LEVEL;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            {value: this.userLevel.SA, displayText: 'SA'},
            {value: this.userLevel.BO_Y_TE, displayText: 'Bộ y tế'},
            {value: this.userLevel.QUAN_LY_VUNG, displayText: 'Quản lý vùng'},
            {value: this.userLevel.SO_Y_TE, displayText: 'Sở y tế'},
            {value: this.userLevel.BENH_VIEN, displayText: 'Cơ sở y tế'}
        ]);
    }

}
