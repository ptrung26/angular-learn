import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

// let uuid = 1;

@Component({
    selector: 'ora-step',
    templateUrl: './ora-step.component.html',
    styleUrls: ['./ora-step.component.scss'],
})
export class OraStepComponent implements OnInit {
    @Input() title: string | TemplateRef<void>;
    @Input() description: string | TemplateRef<void>;
    @Input() disable: boolean;
    @Output() selectedStep = new EventEmitter<any>();
    isActive = false;
    isSuccess = false;
    id: number;

    constructor() {
    }

    ngOnInit(): void {

        // this._id = uuid++;
        // if (this._id === 1) {
        //     this.isActive = true;
        //     this.isSuccess = false;
        // }
    }

    onClickStep() {
        // this.isActive = true;
        // this.isSuccess = false;
        if (this.disable !== true) {
            this.selectedStep.emit(this.id);
        }
    }
}
