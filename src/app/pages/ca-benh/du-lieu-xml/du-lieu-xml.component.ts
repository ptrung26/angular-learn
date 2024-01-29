import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    DuLieuXMLDto,
    DuLieuXMLPagingListRequest,
    DuLieuXMLServiceProxy,
    ReSyncDataCaBenhRequest,
    TRANG_THAI_DU_LIEU_XML,
    USER_LEVEL,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './du-lieu-xml.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class DuLieuXmlComponent extends AppComponentBase implements OnInit {
    rfFormGroup: FormGroup;
    viewShow: 'list' | 'viewCreateOrUpdate' = 'list';
    isView = false;
    dataItem: DuLieuXMLDto;
    userLevel = USER_LEVEL;
    trangThaiDuLieuXML = TRANG_THAI_DU_LIEU_XML;
    dataList: DuLieuXMLDto[] = [];
    yearBC = [];
    maxYear: number = new Date().getFullYear();
    saving = false;

    constructor(
        injector: Injector,
        private _dataService: DuLieuXMLServiceProxy,
        private _fileService: FileDownloadService,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            nam: this.maxYear,
            maTinh: [''],
            donViCoSoId: [0],
        });
    }

    ngOnInit(): void {
        if (this.appSession.user.level === this.userLevel.SO_Y_TE) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
        }
        if (this.appSession.user.level === this.userLevel.BENH_VIEN) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
            this.rfFormGroup.get('donViCoSoId').setValue(this.appSession.user.donViCoSoId);
        }
        for (let i = 2021; i <= this.maxYear; i++) {
            this.yearBC.push(i);
        }
        const input: DuLieuXMLPagingListRequest = new DuLieuXMLPagingListRequest();
        input.nam = this.rfFormGroup.value.nam;
        this._dataService.searchServerPaging(input)
            .pipe()
            .subscribe(result => {
                this.dataList = result;
            });
    }

    showCreateOrEditModal(dataItem?: any): void {
        this.dataItem = dataItem ? dataItem : {};
        this.viewShow = 'viewCreateOrUpdate';
        this.isView = false;
    }

    downloadFileZip(dataItem?: any): void {
        this._dataService.downloadXmlZip(dataItem.id)
            .pipe()
            .subscribe(result => {
                if (result == null) {
                    abp.notify.error('Lỗi');
                } else {
                    this._fileService.downloadTempFile(result);
                }
            });
    }

    reSyncData(dataItem?: any): void {
        let input = new ReSyncDataCaBenhRequest();
        input.duLieuXMLId = dataItem.id;
        this._dataService.reSyncDataCaBenh(input)
            .pipe()
            .subscribe(result => {
                if (result.isSuccessful) {
                    this.notify.info('Đồng bộ lại dữ liệu thành công!!');
                } else {
                    abp.notify.error(result.errorMessage);
                }
            });
    }

    viewModal(dataItem?: any): void {
        this.dataItem = dataItem ? dataItem : {};
        this.viewShow = 'viewCreateOrUpdate';
        this.isView = true;
    }

    onBackToList($event: boolean) {
        this.viewShow = 'list';
        this.refresh();
    }

    refresh(): void {
        abp.ui.setBusy();
        this.saving = true;
        const input: DuLieuXMLPagingListRequest = new DuLieuXMLPagingListRequest();
        input.nam = this.rfFormGroup.value.nam;
        input.maTinh = this.rfFormGroup.value.maTinh;
        input.donViCoSoId = this.rfFormGroup.value.donViCoSoId;
        this._dataService.searchServerPaging(input)
            .pipe()
            .subscribe(result => {
                this.dataList = result;
                abp.ui.clearBusy();
                this.saving = false;
            });
    }
}
