import { AppComponentBase } from '@shared/common/app-component-base';
import { Directive, Injector, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions,
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { USER_LEVEL } from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirCoSoLevel]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: CoSoLevelDirective,
        },
    ],
})
export class CoSoLevelDirective extends AppComponentBase implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    userLevel = USER_LEVEL;

    constructor(injector: Injector) {

        super(injector);
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        if (this.appSession.user.level === this.userLevel.SA || this.appSession.user.level === null || this.appSession.user.level === 0 || this.appSession.user.level === this.userLevel.BO_Y_TE) {
            return of<ISelectOption[]>([
                { value: this.userLevel.BO_Y_TE, displayText: 'Bộ y tế' },
                { value: this.userLevel.QUAN_LY_VUNG, displayText: 'Quản lý vùng' },
                { value: this.userLevel.SO_Y_TE, displayText: 'Sở y tế' },
                { value: this.userLevel.BENH_VIEN, displayText: 'Cơ sở y tế' },
            ]);
        } else if (this.appSession.user.level === this.userLevel.QUAN_LY_VUNG) {
            return of<ISelectOption[]>([
                { value: this.userLevel.SO_Y_TE, displayText: 'Sở y tế' },
                { value: this.userLevel.BENH_VIEN, displayText: 'Cơ sở y tế' },
            ]);
        } else if (this.appSession.user.level === this.userLevel.SO_Y_TE) {
            return of<ISelectOption[]>([
                { value: this.userLevel.BENH_VIEN, displayText: 'Cơ sở y tế' },
            ]);
        } else {
            return of<ISelectOption[]>([
                { value: this.userLevel.BENH_VIEN, displayText: 'Cơ sở y tế' },
            ]);
        }
    }
}
