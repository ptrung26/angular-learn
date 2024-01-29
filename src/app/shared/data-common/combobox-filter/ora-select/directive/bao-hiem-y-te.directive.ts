import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import { BAO_HIEM_Y_TE } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirBaoHiemYTe]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: BaoHiemYTeDirective
        }
    ]
})
export class BaoHiemYTeDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    baoHiemYTe = BAO_HIEM_Y_TE;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.baoHiemYTe.BHYT_CO, displayText: 'Có bảo hiểm y tế' },
            { value: this.baoHiemYTe.BHYT_KHONG, displayText: 'Không có bảo hiểm y tế' }
        ]);
    }
}
