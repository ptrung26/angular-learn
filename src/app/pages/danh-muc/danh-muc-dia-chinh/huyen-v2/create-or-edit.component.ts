import { Component, Injector, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { DanhMucHuyenDto, DanhMucHuyenV2ServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({ templateUrl: './create-or-edit.component.html' })
export default class CreateOrEditHuyenV2Component extends ModalComponentBase implements OnInit {
    rfDataModal: FormGroup;
    dataItem: DanhMucHuyenDto;
    saving = false;

    constructor(injector: Injector, private _dataService: DanhMucHuyenV2ServiceProxy, private fb: FormBuilder) {
        super(injector);
    }

    ngOnInit(): void {
        this.rfDataModal = this.fb.group({
            id: '0',
            maHuyen: ['', Validators.required],
            tenHuyen: ['', Validators.required],
            maTinh: ['', Validators.required],
            cap: [''],
        });

        this.rfDataModal.patchValue(this.dataItem);
    }

    onSubmit(): void {
        if (this.rfDataModal.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
                this.rfDataModal.controls[i].markAsDirty();
                this.rfDataModal.controls[i].updateValueAndValidity();
            }
        } else {
            this.saving = true;
            this._dataService
                .createOrUpdate(this.rfDataModal.value)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    }),
                )
                .subscribe((result) => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.success(true);
                });
        }
    }
}
