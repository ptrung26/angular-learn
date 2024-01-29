import {Input} from '@angular/core';

export class CommonComboBase {
    @Input() nzMode: 'default' | 'multiple' | 'tags' = 'default';
    _value = 0;
    public optionList: any[] = [];
    public optionListSource: any[] = [];
    _isDisabled = false;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    @Input()
    get value() {
        return this.value;
    }

    set value(v: any) {
        this._value = v;
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    onChangeValue(event: any): void {
        this.onChange(event);

    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
        this._value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }

}
