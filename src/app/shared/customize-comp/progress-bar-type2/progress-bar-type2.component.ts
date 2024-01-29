import {Component, OnInit, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {from, interval, Subject, timer, of} from '@node_modules/rxjs';
import {
    map,
    mapTo,
    switchMap,
    startWith,
    scan,
    takeWhile,
    takeUntil,
    debounceTime, distinctUntilChanged, tap, take
} from '@node_modules/rxjs/internal/operators';
import * as _ from 'lodash';


@Component({
    selector: 'progress-bar-type2',
    templateUrl: './progress-bar-type2.component.html',
    styleUrls: ['./progress-bar-type2.component.scss']
})
export class ProgressBarType2Component implements OnInit, OnDestroy {
    @ViewChild('myBar') myBar: ElementRef;
    colorBackground = '#f1f1f1';
    @Input() colorBarFrom = '#85C2E9';
    @Input() colorBarTo = '#3A8CD0';
    @Input() fractionDigits = 2;

    get colorBar() {
        return `linear-gradient(to right, ${this.colorBarFrom} 0%, ${this.colorBarTo} 100%)`;
    }

    _heightBar = 8;
    @Input() set heightBar(v: number) {
        this._heightBar = v ? v : 0;
    }

    get heightBar() {
        return this._heightBar;
    }

    @Input() countInterval = 25;
    private _onDestroy$ = new Subject();
    demSo$: Subject<number> = new Subject<number>();
    _demSo = 0;
    _phanThapPhan = 0;

    @Input() set widthBar(v: number) {
        this.demSo$.next(v);
    }

    get widthBar() {
        return _.round((this._demSo > 0 ? this._demSo - 1 + this._phanThapPhan : this._demSo), this.fractionDigits);
    }

    constructor() {
        this.demSo$
            .pipe(
                debounceTime(300),
                switchMap((item) => {
                    let val = typeof (item) === 'string' ? parseFloat(item) : item;
                    const phanNguyen = Math.floor(val);
                    const phanThapPhan = val - phanNguyen;
                    val = val > 100 ? 101 : phanNguyen + 1;

                    this._phanThapPhan = phanThapPhan;
                    return of(val);
                }),
                distinctUntilChanged(),
                switchMap(endRange => {
                    return timer(0, this.countInterval).pipe(
                        mapTo(this.positiveOrNegative(endRange, this._demSo)),
                        startWith(this._demSo),
                        scan((acc: number, curr: number) => {
                            return acc + curr;
                        }),
                        takeWhile(this.isApproachingRange(endRange, this._demSo))
                    );
                }),
                takeUntil(this._onDestroy$)
            )
            .subscribe((val: number) => {
                this._demSo = val;
            });

    }

    ngOnDestroy(): void {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }


    private positiveOrNegative(endRange, currentNumber) {
        return endRange > currentNumber ? 1 : -1;
    }

    private isApproachingRange(endRange, currentNumber) {
        // const po = this.positiveOrNegative(endRange, currentNumber);
        // if (po === 1) {
        //
        // } else {
        //
        // }
        return endRange > currentNumber
            ? val => val <= endRange
            : val => val >= endRange;
    }

    ngOnInit(): void {

    }
}
