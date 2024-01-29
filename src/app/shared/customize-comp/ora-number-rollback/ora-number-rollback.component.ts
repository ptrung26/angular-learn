import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Provider, ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';

import {of, Subject} from '@node_modules/rxjs';
import * as _ from 'lodash';
import {debounceTime, takeUntil, pairwise, distinctUntilChanged} from '@node_modules/rxjs/internal/operators';
import {switchMap} from '@node_modules/rxjs/operators';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';

const sourceDefault: {
    value: number;
    displayText: string;
}[] = [
    {displayText: '1/4', value: 0.25},
    {displayText: '1/3', value: 0.33},
    {displayText: '1/2', value: 0.5},
    {displayText: '3/4', value: 0.75},
];

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraNumberRollbackComponent),
    multi: true
};

@Component({
    selector: 'ora-number-rollback',
    template: `

        <div class="wrap" *ngIf="swapMode;else elSwapMode" nz-popover
             [(nzPopoverVisible)]="showPopover"
             (nzPopoverVisibleChange)="nzPopoverVisibleChange($event)"
             nzPopoverTrigger="click"
             [nzPopoverContent]="contentTemplate"
        >

            <ng-template #contentTemplate>
                <div style="display: flex;justify-content: space-between;margin-bottom: 5px">
                    <button [class.margin-left-15]="i>0" [class.btn-active]="option.value===formControl.value" nz-button
                            nzType="dashed"
                            *ngFor="let option of sourceKT;index as i"
                            (click)="onClickChonPhanSo(option.value)">
                        {{option.displayText}}
                    </button>
                </div>
                <nz-input-number #ipNumber autoFocus (keydown.enter)="showPopover=false" [nzMin]="min"
                                 [formControl]="formControl" style="width:100%"
                                 [nzFormatter]="formatPoint"></nz-input-number>
            </ng-template>
            <span class="display-text">{{displayText}}</span>
        </div>
        <ng-template #elSwapMode>
            <nz-input-number [nzMin]="min" [formControl]="formControl" style="width:100%"
                             [nzFormatter]="formatPoint"></nz-input-number>
        </ng-template>
    `,
    styleUrls: ['./ora-number-rollback.component.scss'],
    providers: [VALUE_ACCESSOR]

})

export class OraNumberRollbackComponent extends AppComponentBase implements OnInit, ControlValueAccessor, OnDestroy {
    @ViewChild('ipNumber') ipNumber: NzInputNumberComponent;
    sourceKT = _.clone(sourceDefault);
    // isModeInput = true;
    @Input() delayTime = 300;
    @Input() swapMode = true;
    showPopover = false;


    get value() {
        return this.formControl.value;
    }

    @Input() round = 2;

    @Input() set value(v: number | undefined) {
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

    get displayText() {
        const itemFind = sourceDefault.find(x => x.value === this.formControl.value);
        if (itemFind) {
            return itemFind.displayText;
        } else {
            return this.formControl.value ? _.round(this.formControl.value, this.round) : this.formControl.value;
        }
    }

    onWrireValue$: Subject<any> = new Subject<any>();


    constructor(
        injector: Injector,
        private changeDetector: ChangeDetectorRef
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
    formatPoint = (value: number) => _.round(value, this.round);

    ngOnInit() {
        this.formControl.valueChanges.pipe(takeUntil(this.$destroy),
            debounceTime(this.delayTime),
            distinctUntilChanged(),
            pairwise()
        ).subscribe(([prev, next]) => {
            this.preValue = prev;
            this.onChange(next);
            if (this.alowValueChangeEmit) {
                this.valueChange.emit(next);

            }

            this.alowValueChangeEmit = true;
        });
        this.onWrireValue$.pipe(distinctUntilChanged(), debounceTime(100),
            switchMap((value) => of(value))).subscribe(result => {
            this.formControl.setValue(result);
        });
    }

    onClickChonPhanSo(value: number) {
        this.formControl.setValue(value);
        this.showPopover = false;
    }

    nzPopoverVisibleChange($event: boolean) {
        // this.formControl.
        if ($event) {
            this.changeDetector.detectChanges();
            this.ipNumber.inputElement.nativeElement.focus();
        }
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
        this.onWrireValue$.next(obj);
        // tslint:disable-next-line:triple-equals
        // if (sourceDefault.findIndex(x => x.value == obj) > -1) {
        //     this.isModeInput = false;
        // } else {
        //     this.isModeInput = true;
        // }
        // this.value = obj;
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
