import {Component, forwardRef, Injector, Input, OnDestroy, OnInit, Provider} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {Subject} from '@node_modules/rxjs';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraColorPickerComponent),
    multi: true
};

@Component({
    selector: 'ora-color-picker',
    template: `
        <input [style.background]="color"
               readonly
               [colorPicker]="color"
               (colorPickerChange)="colorChange($event)"/>
    `,
    providers: [VALUE_ACCESSOR],
    styles: [`
        input {
            width: 100%
        }
    `]

})

export class OraColorPickerComponent extends AppComponentBase implements OnInit, ControlValueAccessor, OnDestroy {
    _isDisabled = false;
    $destroy: Subject<boolean> = new Subject<boolean>();
    color = '#fffff';

    @Input()
    get value() {
        return this.color;
    }

    set value(v: string) {
        this.color = v;
    }

    @Input()
    get isDisabled() {
        return this._isDisabled;
    }

    set isDisabled(v: boolean) {
        this._isDisabled = v;
    }


    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    colorChange($event: string) {
        this.color = $event;
        this.onChange($event);
    }

    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };


    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }


    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: string): void {
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
