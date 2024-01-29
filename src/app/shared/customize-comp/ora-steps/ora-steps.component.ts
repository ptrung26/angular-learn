import { AfterViewInit, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { Component, ContentChildren, OnInit } from '@angular/core';
import { Subject } from '@node_modules/rxjs';
import { takeUntil } from '@node_modules/rxjs/internal/operators';
import { OraStepComponent } from '@app/shared/customize-comp/ora-steps/ora-step/ora-step.component';

@Component({
    selector: 'ora-steps',
    templateUrl: './ora-steps.component.html',
    styleUrls: ['./ora-steps.component.scss'],

})
export class OraStepsComponent implements OnInit, AfterViewInit, OnDestroy {
    $destroy = new Subject<boolean>();
    @ContentChildren(OraStepComponent) steps: QueryList<OraStepComponent>;

    _currentStep = 0;
    @Input() set currentStep(v: number) {
        if (this.steps) {
            this.goToStep(v, false);
        }
    }

    get currentStep(): number {
        return this._currentStep;
    }

    // @Input() beforeStepChange: Function;
    @Output() currentStepChange = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        const stepFirst = this.steps.first;

        setTimeout(() => {
            stepFirst.isActive = true;
            stepFirst.isSuccess = false;
        });

        this.steps.forEach((step, index) => {
            step.id = index;
            step.selectedStep.pipe(takeUntil(this.$destroy)).subscribe(stepId => {
                this.goToStep(stepId);
            });
        });
    }

    goToStep(stepId, emitValue = true) {
        if (this._currentStep !== stepId) {

            this._currentStep = stepId;
            this.steps.forEach((step, index) => {
                if (step.id < stepId) {
                    setTimeout(() => {
                        step.isActive = true;
                        step.isSuccess = true;
                    });

                } else if (step.id > stepId) {
                    setTimeout(() => {
                        step.isActive = false;
                        step.isSuccess = false;
                    });
                } else {
                    step.isActive = true;
                    step.isSuccess = false;
                }
            });
            if (emitValue) {
                this.currentStepChange.emit(stepId);
            }

        }

    }


    nextStep() {
        if (this._currentStep < this.steps.length - 1) {
            this.goToStep(this._currentStep + 1);

        }
    }

    preStep() {
        if (this._currentStep !== 0) {
            this.goToStep(this._currentStep - 1);
        }
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }

}
