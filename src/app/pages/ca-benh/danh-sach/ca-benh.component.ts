import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    CaBenhPagingListRequest,
    CaBenhServiceProxy,
    DanhMucThuocServiceProxy,
    ExportMauBaoCao01Request,
    USER_LEVEL,
    CaBenhDto,
    NHOM_THUOC,
    NHOM_BENH,
    ExportDanhSachCaBenhRequest,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { UploadCaBenhModalComponent } from './up-load-ca-benh-modal.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './ca-benh.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CaBenhComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;
    viewShow: 'list' | 'viewCreateOrUpdate' = 'list';
    isView = false;
    dataItem: any;
    userLevel = USER_LEVEL;
    thuocDieuTriViemGanB: { value: number; label: string; checked: boolean }[] = [];
    thuocDieuTriViemGanC: { value: number; label: string; checked: boolean }[] = [];
    nhomThuoc = NHOM_THUOC;
    nhomBenh = NHOM_BENH;

    constructor(
        injector: Injector,
        private _dataService: CaBenhServiceProxy,
        private _fileService: FileDownloadService,
        private _thuocService: DanhMucThuocServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            maTinh: [''],
            maHuyen: [''],
            maXa: [''],
            nhomBenh: [-1],
            coSo_MaTinh: [''],
            donViCoSoId: [-1],
            ketQuaXetNghiem: [-1],
            baoHiemYTe: [-1],
            nhiemHIV: [-1],
            tuVong: [-1],
        });
    }

    ngOnInit(): void {
        this._thuocService.getToList().subscribe((result) => {
            result.forEach((item) => {
                if (item.nhomThuoc === this.nhomThuoc.VIEM_GAN_B) {
                    this.thuocDieuTriViemGanB.push({ value: item.id, label: item.tenThuoc, checked: false });
                } else if (item.nhomThuoc === this.nhomThuoc.VIEM_GAN_C) {
                    this.thuocDieuTriViemGanC.push({ value: item.id, label: item.tenThuoc, checked: false });
                }
            });
        });
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        if (this.appSession.user.level === this.userLevel.SO_Y_TE) {
            this.rfFormGroup.get('coSo_MaTinh').setValue(this.appSession.user.maTinh);
        }
        if (this.appSession.user.level === this.userLevel.BENH_VIEN) {
            this.rfFormGroup.get('coSo_MaTinh').setValue(this.appSession.user.maTinh);
            this.rfFormGroup.get('donViCoSoId').setValue(this.appSession.user.donViCoSoId);
        }
        const input: CaBenhPagingListRequest = new CaBenhPagingListRequest();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.maTinh = formValue.maTinh;
        input.maHuyen = formValue.maHuyen;
        input.maXa = formValue.maXa;
        input.nhomBenh = formValue.nhomBenh;
        input.coSo_MaTinh = formValue.coSo_MaTinh;
        input.donViCoSoId = formValue.donViCoSoId;
        input.ketQuaXetNghiem = formValue.ketQuaXetNghiem;
        input.baoHiemYTe = formValue.baoHiemYTe;
        input.nhiemHIV = formValue.nhiemHIV;
        input.tuVong = formValue.tuVong;
        this._dataService
            .searchServerPaging(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    clear() {
        this.rfFormGroup.reset();
        this.refresh();
    }

    showCreateOrEditModal(dataItem?: any): void {
        this.dataItem = dataItem ? dataItem : {};
        this.viewShow = 'viewCreateOrUpdate';
        this.isView = false;
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

    delete(dataItem: any): void {
        this.message.confirm('', 'Bạn có chắc chắn muốn xóa bệnh nhân: ' + dataItem.hoTen + '?', (isConfirmed) => {
            if (isConfirmed) {
                this._dataService.delete(dataItem.id).subscribe(() => {
                    this.refresh();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }

    onClickUpload(data: any) {
        this.modalHelper
            .create(
                UploadCaBenhModalComponent,
                {
                    dataInput: data,
                    thuocDieuTriViemGanB: this.thuocDieuTriViemGanB,
                    thuocDieuTriViemGanC: this.thuocDieuTriViemGanC,
                },
                {
                    size: 1280,
                    includeTabs: true,
                    modalOptions: {
                        nzTitle: 'Import danh sách ca bệnh',
                    },
                },
            )
            .subscribe((result) => {
                if (result) {
                    this.refresh();
                }
            });
    }

    exportDanhSachCaBenh() {
        abp.ui.setBusy();
        const input: ExportDanhSachCaBenhRequest = new ExportDanhSachCaBenhRequest();
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.maTinh = formValue.maTinh;
        input.maHuyen = formValue.maHuyen;
        input.maXa = formValue.maXa;
        input.nhomBenh = formValue.nhomBenh;
        input.coSo_MaTinh = formValue.coSo_MaTinh;
        input.donViCoSoId = formValue.donViCoSoId;
        input.ketQuaXetNghiem = formValue.ketQuaXetNghiem;
        input.baoHiemYTe = formValue.baoHiemYTe;
        input.nhiemHIV = formValue.nhiemHIV;
        input.tuVong = formValue.tuVong;
        this._dataService
            .exportDanhSachCaBenh(input)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                this._fileService.downloadTempFile(result);
                this.notify.success('Download thành công');
            });
    }
}
