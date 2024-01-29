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
    OnDestroy
} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ISelectOption, ISelectOptions, SelectOptions} from './model';
import {debounceTime, distinctUntilChanged, mergeMap} from 'rxjs/operators';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraRadioComponent),
    multi: true
};

@Component({
    selector: 'ora-radio',
    template: `
        <nz-radio-group [formControl]="control">
            <ng-container *ngFor="let option of _option">
                <label [ngStyle]="labelStyle" nz-radio [nzValue]="option.value">{{option.displayText}}</label>
            </ng-container>
        </nz-radio-group>
    `,
    providers: [VALUE_ACCESSOR]
})
export class OraRadioComponent implements OnInit, ControlValueAccessor, OnDestroy {

    options$: Observable<{ value: string; displayText: string }[]> = of([]);
    _option: { value: string; displayText: string }[] = [];
    _unSubcription: Subscription[] = [];
    @Input() labelStyle: any = {};

    @Input()
    get value() {
        return this.control.value;
    }

    set value(v: any) {
        this.control.setValue(v);
    }

    _isDisabled = false;

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
        if (v) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }


    @Input() control = new FormControl({value: '', disabled: this._isDisabled});


    private onChange = (v: any) => {
    };
    private onTouched = () => {
    };

    onChangeValue(event: any): void {
        this.onChange(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }

    constructor(
        @Optional() @Inject(SelectOptions) directive: ISelectOptions
    ) {
        // this.options$ = directive?.options$;
        // this.optionsSource$ = directive?.options$;
        if (directive) {
            this.options$ = directive.options$;
            this._unSubcription.push(this.options$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(result => {
                this._option = result;
                if (result.length > 0 && this.control.value && result.findIndex(x => x.value === this.control.value) === -1) {
                    this.control.setValue(undefined);
                    // this.onChangeValue(undefined);
                }
            }));
        }
        this._unSubcription.push(this.control.valueChanges.subscribe(result => {
            this.onChangeValue(result);
        }));
    }

    ngOnDestroy(): void {
        this._unSubcription.forEach(item => item.unsubscribe());
    }

    ngOnInit(): void {

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
        this.disabled = isDisabled;
    }

    //#endregion


}
