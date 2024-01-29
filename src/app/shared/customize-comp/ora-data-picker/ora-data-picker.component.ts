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
    OnDestroy, ViewChild, ElementRef, AfterViewInit,
} from '@angular/core';
import { fromEvent, Observable, of, Subject, Subscription } from 'rxjs';
import { ControlValueAccessor, Form, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { NzDatePickerComponent } from '@node_modules/ng-zorro-antd/date-picker';
import { DateTime } from 'luxon';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraDataPickerComponent),
    multi: true,
};

@Component({
    selector: 'ora-date-picker',
    template: `
        <div class="main-ora-date" (mouseenter)="mouseEnterMain()" (mouseleave)="mouseLeaveMain()">
            <nz-date-picker class="ora-date" #refDate style="width:100%" [nzPlaceHolder]="placeHolder"
                            [nzDisabledDate]="disabledDate"
                            tabindex="-1"
                            [formControl]="control" [nzDisabled]='disabled'
                            nzFormat="dd/MM/yyyy"></nz-date-picker>
            <input #refInput class="ora-input-date" nz-input
                   [placeholder]="placeHolder"
                   [formControl]="_inputValue"
                   [textMask]="{mask: _mask}"/>
            <i class="ora-close" [hidden]="_isShowIconCalendar" (click)="onClearClick()" nz-icon nzType="close-circle"
               nzTheme="outline"></i>
            <i class="ora-calendar" [hidden]="!_isShowIconCalendar" (click)="refDate.picker.showOverlay()" nz-icon
               nzType="calendar"
               nzTheme="outline"></i>
        </div>
    `,
    styles: [`
        .main-ora-date {
            position: relative;
        }

        .ora-date {
            border: 0;
        }

        .ora-input-date {
            position: absolute;
            top: 0;
            left: 0
        }

        .ora-close {
            position: absolute;
            top: 7px;
            right: 5px;
        }

        .ora-calendar {
            position: absolute;
            top: 7px;
            right: 5px;
        }
    `],
    providers: [VALUE_ACCESSOR],
})
export class OraDataPickerComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
    @ViewChild('refDate') refDate: NzDatePickerComponent;
    @ViewChild('refInput') refInput: ElementRef;
    @Input() disabledDate?: (d: Date) => boolean;
    @Input() placeHolder = 'Ngày/Tháng/Năm';
    _mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    $destroy: Subject<boolean> = new Subject<boolean>();
    isWriteValue = false;

    _isShowIconCalendar = true;

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
        if(v)
        {
            this.control.disable();
        }
        else
        {
            this.control.enable();
        }
    }

    @Input() control = new FormControl({ value: '', disabled: this._isDisabled });
    _inputValue: FormControl = new FormControl({ value: undefined, disabled: this._isDisabled });


    private onChange = (v: any) => {
    };
    private onTouched = () => {
    };

    onChangeValue(event: any): void {
        this.onChange(event);
        // this.refDate.picker.hideOverlay();
    }

    onFocus(event: any): void {
        this.onTouched();
    }

    mouseLeaveMain() {
        this._isShowIconCalendar = true;
    }

    mouseEnterMain() {
        if (this._inputValue.value) {
            this._isShowIconCalendar = false;
        } else {
            this._isShowIconCalendar = true;
        }
    }

    constructor() {

    }

    ngAfterViewInit(): void {
        fromEvent<any>(this.refInput.nativeElement, 'click')
            .pipe(
                debounceTime(400),
                takeUntil(this.$destroy),
            ).subscribe(() => {
            this.onInputClick();
        });
    }

    onInputClick() {
        this.refDate.picker.showOverlay();
        setTimeout(() => { // this will make the execution after the above boolean has changed
            this.refInput.nativeElement.focus();
        }, 0);
    }

    onClearClick() {
        this._inputValue.setValue(undefined);
        this._isShowIconCalendar = true;
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }

    ngOnInit(): void {
        this.control.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged((prev, curr) => {
            return _.isEqual(prev, curr);
        })).subscribe((result: Date) => {
            if (this.isWriteValue) {
                if (result) {
                    const valueText = DateTime.fromJSDate(result).toFormat('dd/MM/yyyy');
                    this._inputValue.setValue(valueText);
                }

                this.onChangeValue(DateTime.fromJSDate(result));
            }

        });
        this._inputValue.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe(result => {
            try {
                const arrStr = result.split('/');
                if (!isNaN(arrStr[0]) && !isNaN(arrStr[1]) && !isNaN(arrStr[2])) {
                    const date = DateTime.fromFormat(result, 'dd/MM/yyyy');
                    if (date.isValid) {
                        if (typeof this.disabledDate === 'function') {
                            if (this.disabledDate(date.toJSDate())) {
                                this._inputValue.setValue(undefined);
                            } else {
                                this.control.setValue(date.toJSDate());
                                this.refDate.picker.hideOverlay();
                            }
                        } else {
                            this.control.setValue(date.toJSDate());
                            this.refDate.picker.hideOverlay();
                        }
                    } else {
                        this.control.setValue(undefined);
                    }

                } else {
                    this.control.setValue(undefined);
                }

            } catch (e) {
                this.control.setValue(undefined);
            }
        });
    }

    //#region base ControlValueAccessor
    writeValue(obj: DateTime): void {
        if (obj) {
            this.value = obj.toJSDate();
            const valueText = obj.toFormat('dd/MM/yyyy');
            this._inputValue.setValue(valueText);
        } else if (this.isWriteValue) {
            this._inputValue.setValue(undefined);
        }
        this.isWriteValue = true;

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
