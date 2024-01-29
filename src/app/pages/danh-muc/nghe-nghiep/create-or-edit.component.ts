import {Component, Injector, Input, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {DanhMucNgheNghiepServiceProxy, DanhMucNgheNghiepDto} from '@shared/service-proxies/service-proxies';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';


@Component({
    templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditNgheNghiepComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: DanhMucNgheNghiepDto;
    rfDataModal: FormGroup;
    saving = false;

    constructor(
        injector: Injector,
        private _dataService: DanhMucNgheNghiepServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.rfDataModal = this.fb.group({
            id: '0',
            ten: ['', [Validators.required]],
            moTa: [''],
            sortOrder:  ['1'],
            isActive: [true]
        });
        this.rfDataModal.patchValue(this.dataItem);
    }

    save(): void {
        if (this.rfDataModal.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
                this.rfDataModal.controls[i].markAsDirty();
                this.rfDataModal.controls[i].updateValueAndValidity();
            }
        } else {
            this.saving = true;
            this._dataService.createOrUpdate(this.rfDataModal.value)
                .pipe(finalize(() => {
                    this.saving = false;
                }))
                .subscribe(result => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.success(true);
                });
        }
    }
}
