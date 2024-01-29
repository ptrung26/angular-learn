import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import {
    CaBenhDto,
    CaBenhPagingListRequest,
    CaBenhServiceProxy,
    DanhMucThuocServiceProxy,
    NHOM_BENH,
    NHOM_THUOC,
    USER_LEVEL,
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-ca-benh-v2',
    templateUrl: './ca-benh-v2.component.html',
})
export class CaBenhV2Component extends PagedListingComponentBase<any> {
    viewShow: 'list' | 'viewCreateOrUpdate' = 'list';
    rfFormGroup: FormGroup;
    userLevel = USER_LEVEL;
    thuocDieuTriViemGanB: { value: number; label: string; checked: boolean }[] = [];
    thuocDieuTriViemGanC: { value: number; label: string; checked: boolean }[] = [];
    nhomThuoc = NHOM_THUOC;
    nhomBenh = NHOM_BENH;
    dataItem?: any;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private _dataService: CaBenhServiceProxy,
        private _fileService: FileDownloadService,
        private _thuocService: DanhMucThuocServiceProxy,
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
        const input: CaBenhPagingListRequest = new CaBenhPagingListRequest();
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.maTinh = formValue.maTinh;
        input.maHuyen = formValue.maHuyen;
        input.maXa = formValue.maXa;
        input.nhomBenh = formValue.nhomBenh;
        input.coSo_MaTinh = formValue.coSo_MaTinh;
        input.donViCoSoId = formValue.donViCoSoId;
        input.ketQuaXetNghiem = formValue.ketQuaXetNghiem;
        input.baoHiemYTe = formValue.baoHiemyTe;
        input.nhiemHIV = formValue.nhiemHIV;
        input.tuVong = formValue.tuVong;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        input.maxResultCount = request.maxResultCount;
        this._dataService
            .searchServerPaging(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    pageNumberChange(): void {
        if (this.pageNumber > 0) {
            this.restCheckStatus(this.dataList);
            this.getDataPage(this.pageNumber);
        }
    }

    showCreateOrEditModal(dataItem?: any): void {
        this.dataItem = dataItem ? dataItem : {};
        this.viewShow = 'viewCreateOrUpdate';
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
}
