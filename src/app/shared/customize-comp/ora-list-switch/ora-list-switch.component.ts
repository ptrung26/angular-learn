import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';
import Guid from '@app/shared/common/custom/guid';
import { forwardRef, Provider } from '@node_modules/@angular/core';
import { NG_VALUE_ACCESSOR } from '@node_modules/@angular/forms';

export interface IOraSwitch {
    id?: any,
    title: string,
    imgSrc?: string
}

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraListSwitchComponent),
    multi: true,
};


@Component({
    selector: 'ora-list-switch',
    templateUrl: './ora-list-switch.component.html',
    styleUrls: ['./ora-list-switch.component.scss'],
    providers: [VALUE_ACCESSOR],
})
export class OraListSwitchComponent implements OnInit, ControlValueAccessor {
    @ViewChild('listSwitch') listSwitch: ElementRef;
    selectedId: any;
    _dataSource: IOraSwitch[] = [];
    @Input() set dataSource(v: IOraSwitch[]) {
        this._dataSource = v ? v.map(item => {
            const res: IOraSwitch = {
                id: item.id ? item.id : Guid.newGuid(),
                imgSrc: item.imgSrc,
                title: item.title,
            };
            return res;
        }) : [];
    }
//#region
    isDown = false;
    startX: number;
    scrollLeft: number;

    get dataSource(): IOraSwitch[] {
        return this._dataSource;
    }

    @Input() set value(v: any) {
        this.selectedId = v;
    }

    get value() {
        return this.selectedId;
    }


    _isDisabled = false;

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    constructor() {
    }

    ngOnInit(): void {
    }

    onMouseDownList($event: MouseEvent) {
        const slider = this.listSwitch.nativeElement;
        this.isDown = true;
        slider.classList.add('active');
        this.startX = $event.pageX - slider.offsetLeft;
        this.scrollLeft = slider.scrollLeft;
    }

    mouseMove($event: MouseEvent) {
        if (!this.isDown) {
            return;
        }
        $event.preventDefault();
        const slider = this.listSwitch.nativeElement;
        const x = $event.pageX - slider.offsetLeft;
        const walk = (x - this.startX) * 2; //scroll-fast
        slider.scrollLeft = this.scrollLeft - walk;
    }

    mouseLeave() {
        this.isDown = false;
        const slider = this.listSwitch.nativeElement;
        slider.classList.remove('active');
    }

    mouseUp() {
        this.isDown = false;
        const slider = this.listSwitch.nativeElement;
        slider.classList.remove('active');
    }

    onClick(i: number) {
        this.selectedId = this.dataSource[i].id;
        this.onChange(this.selectedId);
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
