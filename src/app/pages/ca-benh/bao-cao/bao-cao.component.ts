import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    CaBenhServiceProxy, ExportMauBaoCao01Request, USER_LEVEL, CaBenhDto, NHOM_THUOC,
    NHOM_BENH,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './bao-cao.component.html',
    styleUrls: ['./bao-cao.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class BaoCaoCaBenhComponent extends AppComponentBase implements OnInit {
    rfFormGroup: FormGroup;
    userLevel = USER_LEVEL;
    nhomThuoc = NHOM_THUOC;
    nhomBenh = NHOM_BENH;
    maxYear: number = new Date().getFullYear();
    kyBC = [];
    yearBC = [];

    constructor(
        injector: Injector,
        private _dataService: CaBenhServiceProxy,
        private _fileService: FileDownloadService,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            maTinh: [''],
            donViCoSoId: [''],
            kyBaoCao: [1, [Validators.required]],
            namBaoCao: [this.maxYear, [Validators.required]],
            thangBaoCao: [0],
        });
    }

    ngOnInit(): void {
        this.yearBC = [this.maxYear, this.maxYear - 1, this.maxYear - 2, this.maxYear - 3, this.maxYear - 4];
        this.kyBC = [{ value: 1, label: 'Theo Năm' }, { value: 2, label: 'Theo Tháng' }];
        if (this.appSession.user.level === this.userLevel.SO_Y_TE) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
        }
        if (this.appSession.user.level === this.userLevel.BENH_VIEN) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
            this.rfFormGroup.get('donViCoSoId').setValue(this.appSession.user.donViCoSoId);
        }
    }

    clear() {
        this.rfFormGroup.reset();
    }

    exportExcelMauBaoCao01() {
        if (this.rfFormGroup.invalid) {
            this.notify.error('Vui lòng chọn Kỳ báo cáo và Năm báo cáo');
            // tslint:disable-next-line:forin
            for (const i in this.rfFormGroup.controls) {
                this.rfFormGroup.controls[i].markAsDirty();
                this.rfFormGroup.controls[i].updateValueAndValidity();
            }
        } else {
            abp.ui.setBusy();
            const input: ExportMauBaoCao01Request = new ExportMauBaoCao01Request();
            const formValue = this.rfFormGroup.value;
            input.maTinh = formValue.maTinh;
            input.donViCoSoId = formValue.donViCoSoId;
            input.namBaoCao = formValue.namBaoCao;
            input.thangBaoCao = formValue.thangBaoCao;
            this._dataService.exportMauBaoCao01(input).pipe(finalize(() => abp.ui.clearBusy())).subscribe(result => {
                this._fileService.downloadTempFile(result);
                this.notify.success('Download thành công');
            });
        }
    }

}
