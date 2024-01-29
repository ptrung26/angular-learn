import { Directive } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISelectOption, ISelectOptions, SelectOptions } from '@app/shared/data-common/combobox-filter/ora-select/model';
import { NHOM_DICH_VU } from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirNhomDichVu]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: NhomDichVuDirective,
        },
    ],
})
export class NhomDichVuDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    nhomDichVu = NHOM_DICH_VU;

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: this.nhomDichVu.XET_NGHIEM, displayText: 'Xét nghiệm' },
            { value: this.nhomDichVu.THUOC, displayText: 'Thuốc' },
        ]);
    }
}
