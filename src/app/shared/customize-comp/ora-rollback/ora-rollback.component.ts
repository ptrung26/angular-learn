import {Component, EventEmitter, forwardRef, Injector, Input, OnDestroy, OnInit, Output, Provider} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    ComboboxItemDto
} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {Subject} from '@node_modules/rxjs';
import {debounceTime, takeUntil, pairwise} from '@node_modules/rxjs/internal/operators';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraRollbackComponent),
    multi: true
};

@Component({
    selector: 'ora-rollback',
    template: `
        <input nz-input [formControl]="formControl" style="width:100%">
    `,
    providers: [VALUE_ACCESSOR]

})

export class OraRollbackComponent extends AppComponentBase implements OnInit, ControlValueAccessor, OnDestroy {


    @Input()
    get value() {
        return this.formControl.value;
    }

    set value(v: number | undefined) {
        this.formControl.setValue(v);
    }

    @Input()
    get isDisabled() {
        return this._isDisabled;
    }

    set isDisabled(v: boolean) {
        if (v) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
        this._isDisabled = v;
    }


    constructor(
        injector: Injector,
    ) {
        super(injector);
    }


    formControl: FormControl = new FormControl();
    _isDisabled = false;
    preValue: number;
    $destroy: Subject<boolean> = new Subject<boolean>();
    @Output() valueChange = new EventEmitter<number>();
    alowValueChangeEmit = true; // Nếu true: sẽ  emit valueChange ; ngược lại sẽ không emit
    @Input() min: number;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    ngOnInit() {
        this.formControl.valueChanges.pipe(takeUntil(this.$destroy),
            debounceTime(500),
            pairwise()
        ).subscribe(([prev, next]) => {
            this.preValue = prev;
            this.onChange(next);
            if (this.alowValueChangeEmit) {
                this.valueChange.emit(next);
            }
            this.alowValueChangeEmit = true;
        });
    }

    rollbackPreValue() {
        this.alowValueChangeEmit = false;
        this.formControl.setValue(this.preValue);
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }


    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: number): void {
        this.value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

}
