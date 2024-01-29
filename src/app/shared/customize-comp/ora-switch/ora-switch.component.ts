import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forwardRef, Input, Provider, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';

const imgSrcDefault = '/assets/common/icon/no-food.svg';
const imgLinkBase: string = AppConsts.remoteServiceBaseUrl + '/File/GoToViewImage?imgId=';
const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraSwitchComponent),
    multi: true,
};


@Component({
    selector: 'ora-switch',
    templateUrl: './ora-switch.component.html',
    styleUrls: ['./ora-switch.component.scss'],
    providers: [VALUE_ACCESSOR],
})
export class OraSwitchComponent implements OnInit, ControlValueAccessor {
    isActive = false;
    _imgSrc: string = imgSrcDefault;
    @Input() set imgSrc(v: string) {
        this._imgSrc = v ? imgLinkBase + v : imgSrcDefault;
    }

    @Input() title: string | TemplateRef<any>;
    @Input() alowClickToChange = true;
    @Output() onClick = new EventEmitter<boolean>();

    @Input() set value(v: boolean) {
        this.isActive = v;
    }

    get value() {
        return this.isActive;
    }


    _isDisabled = false;

    @Input() set disabled(v: boolean) {
        this._isDisabled = v;
    }

    get disabled() {
        return this._isDisabled;
    }


    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    constructor() {
    }

    changeValue() {
        if (this.alowClickToChange) {
            this.isActive = !this.isActive;
            this.onChange(this.isActive);
        } else {
            this.onClick.emit(this.isActive);
        }
    }

    ngOnInit(): void {
    }

    writeValue(value: boolean): void {
        this.value = value;
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
