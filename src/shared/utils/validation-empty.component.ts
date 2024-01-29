import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import * as _ from 'lodash';

class ErrorDef {
    error: string;
    localizationKey: string;
    errorProperty: string;
}

@Component({
    selector: 'validation-empty',
    template: `<small #mySpan *ngIf="isError" class="help-block" [ngClass]="isError ? 'custom-error-validate':''" style="color: #e40909; display: none;">{{mess}}</small>`
})
export class ValidationEmptyComponent implements OnChanges {
    @Input() dataForm;
    @Input() type;
    @Input() message = 'Không được để trống';
    @Input() tagElementRef: any;
    mess: string;
    isError = false;
    @ViewChild('mySpan') _mySpan: ElementRef;

    constructor(
        private appLocalizationService: AppLocalizationService
    ) { }

    checkValidate() {
        this.isError = false;
        let _form = this.dataForm;
        if (AppUtilityService.isNullOrEmpty(_form)) {
            this.isError = true;
            this.mess = this.message == null ? 'Không để trống' : this.message;
            return this.isError;
        }
        if (this.type === 'email' && !AppUtilityService.validateEmail(_form)) {
            //Promise.resolve().then(() => this.isError = true);
            this.isError = true;
            this.mess = this.message == null ? 'Email không đúng định dạng' : this.message;
            return this.isError;
        }
        if (this.isError) {
            this.tagElementRef.style.display = 'block'
        }
    };

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes.dataForm.currentValue === null) {
        //     this._mySpan.nativeElement.style.display = 'block';
        // }
        this.checkValidate();
    }
}
