import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, DanhMucTinhServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { debounceTime } from '@node_modules/rxjs/internal/operators';
import { ISelectOption } from '@app/shared/data-common/combobox-filter/ora-select/model';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TinhComboComponent),
    multi: true,
};

@Component({
    selector: 'tinh-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear [nzPlaceHolder]="placeHolder"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR],

})

export class TinhComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    public optionList: ComboboxItemDto[] = [];
    public optionListSource: ComboboxItemDto[] = [];
    _isDisabled = false;
    @Input() placeHolder = 'Chọn...';
    @Input() isDeleteTextTinh = false;
    @Output() onItemSelected = new EventEmitter<string>();

    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private  _tinhService: DanhMucTinhServiceProxy,
    ) {
        super(injector);
    }

    _value = '';

    @Input()
    get value() {
        return this._value;
    }

    set value(v: string) {
        this._value = v;
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    ngOnInit() {
        this._comboboxService.getComboboxDataObs('tinh', this._tinhService.comboBoxData())
            .pipe(debounceTime(300))
            .subscribe(result => {
                this.optionList = result;
                this.optionListSource = this.optionList;
            });
    }

    onChangeValue(event: any): void {
        this.onChange(event);
        let obj = this.optionList.find(x => x.value === event);
        this.onItemSelected.emit(obj?.displayText);
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
        this._isDisabled = isDisabled;
    }

    private onChange: Function = (v: any) => {
    };

    private onTouched: Function = () => {
    };

}
