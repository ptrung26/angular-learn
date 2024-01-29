import {
    Component,
    OnInit,
    Optional,
    Inject,
    Input,
    Provider,
    forwardRef,
    EventEmitter,
    Output,
    OnDestroy, OnChanges, TemplateRef
} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ISelectOption, ISelectOptions, SelectOptions} from './model';
import {mergeMap} from 'rxjs/operators';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraSelectComponent),
    multi: true
};

@Component({
    selector: 'ora-select',
    templateUrl: './ora-select.component.html',
    styleUrls: ['./ora-select.component.scss'],
    providers: [VALUE_ACCESSOR]
})
export class OraSelectComponent implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {

    options: ISelectOption[] = [];
    optionsSource: ISelectOption[] = [];
    @Input() refNotFound: TemplateRef<any> | string = 'Không tìm thấy...';
    @Input() placeHolder = 'Chọn...';
    @Input() closeOnSelect = false;
    @Input() control = new FormControl(null);
    @Input() allowClear = true;
    @Output() onItemSelected = new EventEmitter<ISelectOption>();

    @Input()
    selectMode?: 'default' | 'multiple' | 'tags' = 'default';

    _isDisabled = false;

    @Input()
    get value() {
        return this.control.value;
    }

    set value(v: any) {
        if (!((v === null || v === undefined) && (this.control.value === null || this.control.value === undefined))) {
            this.control.setValue(v);
        }
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    private onChange = (v: any) => {
    };
    private onTouched = () => {
    };

    onChangeValue(event: any): void {
        this.onChange(event);
        this.onItemSelected.emit(event);
        // this.getItemSelect();
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.options = this.optionsSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }


    constructor(
        @Optional() @Inject(SelectOptions) private directive: ISelectOptions
    ) {
        if (directive) {
            directive.options$.subscribe(ressult => {
                this.options = ressult;
                this.optionsSource = ressult;
            });
        }
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    }

    //#region base ControlValueAccessor
    writeValue(obj: any): void {
        this.value = obj;
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }

    //#endregion


}
