import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Provider } from '@angular/core';
import {
    debounceTime,
    distinctUntilChanged, map,
    mapTo,
    scan,
    startWith,
    switchMap, takeUntil, takeWhile,
} from '@node_modules/rxjs/internal/operators';
import { of, Subject, timer } from '@node_modules/rxjs';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraSliderComponent),
    multi: true,
};

@Component({
    selector: 'ora-slider',
    template: `
        <div class="wrap-root">
            <div class="slider">
                <nz-slider [ngClass]="mauSac" [nzMin]="0" [nzMax]="100" [ngModel]="valueBar"
                           (ngModelChange)="sliderChange($event)"></nz-slider>
            </div>
            <div class="number">
                <nz-input-number [nzMin]="0" [nzMax]="100"
                                 style="width:80px"
                                 [nzFormatter]="formatterPercent"
                                 [nzParser]="parserPercent"
                                 (ngModelChange)="inputChange($event)"
                                 [ngModel]="valueBar"></nz-input-number>
            </div>
        </div>
    `,
    styleUrls: ['./ora-slider.component.scss'],
    providers: [VALUE_ACCESSOR],
})
export class OraSliderComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() mauSac: 'mau-do' | 'mau-xanh' | 'mau-vang' | 'mac-dinh' | 'mac-tim' = 'mac-dinh';
    @Input() countInterval = 5;
    @Input() fractionDigits = 2;
    usingAnimation = true;
    private _onDestroy$ = new Subject();
    demSo$: Subject<number> = new Subject<number>();
    _demSo = 0;
    _phanThapPhan = 0;
    oldValue = 0;
    $emitValue: Subject<number> = new Subject<number>();


    @Input() set valueBar(v: number) {
        if (this.usingAnimation) {
            this.demSo$.next(v);
        } else {
            this._demSo = v > 100 ? 101 : v + 1;
        }
    }

    get valueBar() {
        return _.round((this._demSo > 0 ? this._demSo - 1 + this._phanThapPhan : this._demSo), this.fractionDigits);
    }

    _isDisabled = false;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };


    formatterPercent = (value: number) => `${value} %`;
    parserPercent = (value: string) => value.replace(' %', '');

    constructor() {
        this.demSo$
            .pipe(
                debounceTime(100),
                map((item) => {
                    let val = typeof (item) === 'string' ? parseFloat(item) : item;
                    const phanNguyen = Math.floor(val);
                    const phanThapPhan = val - phanNguyen;
                    val = val > 100 ? 101 : phanNguyen + 1;

                    this._phanThapPhan = phanThapPhan;
                    return val;
                }),
                // switchMap((item) => {
                //     let val = typeof (item) === 'string' ? parseFloat(item) : item;
                //     const phanNguyen = Math.floor(val);
                //     const phanThapPhan = val - phanNguyen;
                //     val = val > 100 ? 101 : phanNguyen + 1;
                //
                //     this._phanThapPhan = phanThapPhan;
                //     return of(val);
                // }),
                // distinctUntilChanged(),
                switchMap(endRange => {
                    return timer(0, this.countInterval).pipe(
                        mapTo(this.positiveOrNegative(endRange, this._demSo)),
                        startWith(this._demSo),
                        scan((acc: number, curr: number) => {
                            return acc + curr;
                        }),
                        takeWhile(this.isApproachingRange(endRange, this._demSo)),
                    );
                }),
                takeUntil(this._onDestroy$),
            )
            .subscribe((val: number) => {
                this._demSo = val;
            });
    }

    writeValue(obj: any): void {
        this.oldValue = this.valueBar;
        this.valueBar = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }

    private positiveOrNegative(endRange, currentNumber) {
        return endRange > currentNumber ? 1 : -1;
    }

    private isApproachingRange(endRange, currentNumber) {
        return endRange > currentNumber
            ? val => val <= endRange
            : val => val >= endRange;
    }

    ngOnDestroy(): void {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }

    ngOnInit(): void {
        this.$emitValue.pipe(takeUntil(this._onDestroy$), debounceTime(100))
            .subscribe(result => {
                this.usingAnimation = false;
                this.oldValue = this.valueBar;
                this.valueBar = result;
                this.onChange(result);
                this.usingAnimation = true;
            });
    }

    inputChange($event: any) {
        this.$emitValue.next($event);
    }

    sliderChange($event: any) {
        this.$emitValue.next($event);
    }
}
