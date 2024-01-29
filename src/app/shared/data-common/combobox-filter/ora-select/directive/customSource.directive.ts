import {Directive, Input } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';

@Directive({
    selector: '[dirCustomSource]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: CustomSourceDirective
        }
    ]
})
export class CustomSourceDirective implements ISelectOptions {

    @Input() set source(v: ISelectOption[]) {
        this.options$.next(v);
    }

    options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);

    constructor() {
    }


}
