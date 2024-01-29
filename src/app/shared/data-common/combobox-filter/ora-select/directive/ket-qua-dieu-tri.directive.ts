import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ISelectOption, ISelectOptions, SelectOptions } from '@app/shared/data-common/combobox-filter/ora-select/model';
import { KET_QUA_DIEU_TRI } from '@shared/service-proxies/service-proxies';
@Directive({
    selector: '[dirKetQuaDieuTri]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: KetQuaDieuTriDirective,
        },
    ],
})
export class KetQuaDieuTriDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    ketQuaDieuTri = KET_QUA_DIEU_TRI;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.ketQuaDieuTri.NGHI_NGO, displayText: 'Nghi nghờ' },
            { value: this.ketQuaDieuTri.LANH_TINH, displayText: 'Lành tính' },
            { value: this.ketQuaDieuTri.AC_TINH, displayText: 'Ác tính' },
        ]);
    }
}
