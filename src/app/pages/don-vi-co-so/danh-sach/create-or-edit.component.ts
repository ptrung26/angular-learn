import { Component, Injector, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DonViCoSoServiceProxy, USER_LEVEL } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';


@Component({
    templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditDonViCoSoComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: any;
    rfDataModal: FormGroup;
    saving = false;
    userLevel = USER_LEVEL;

    constructor(
        injector: Injector,
        private _dataService: DonViCoSoServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.rfDataModal = this.fb.group({
            id: '0',
            level: ['', [Validators.required]],
            maCoSo: ['', [Validators.required]],
            tenCoSo: ['', [Validators.required]],
            maTinh: ['', [Validators.required]],
            maHuyen: ['', [Validators.required]],
            maXa: ['', [Validators.required]],
            diaChi: [''],
            dienThoai: [''],
            email: [''],
            website: [''],
            fax: [''],
        });
        this.rfDataModal.patchValue(this.dataItem);

        if (this.appSession.user.level == this.userLevel.SO_Y_TE) {
            this.rfDataModal.get('maTinh').setValue(this.appSession.user.maTinh);
        }
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
