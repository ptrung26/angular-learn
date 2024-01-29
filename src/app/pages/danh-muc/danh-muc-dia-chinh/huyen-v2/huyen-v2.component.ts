import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import {
    DanhMucHuyenDto,
    DanhMucHuyenPagingListRequest,
    DanhMucHuyenV2ServiceProxy,
    ExportDanhSachHuyenRequest,
    ImportDanhMucHuyenV2Dto,
    UploadExcelDanhSachHuyenRequest,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import CreateOrEditHuyenV2Component from './create-or-edit.component';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './huyen-v2.component.html',
})
export class HuyenV2ComponentApp extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;
    dataList: DanhMucHuyenDto[];

    constructor(
        injector: Injector,
        private _dataService: DanhMucHuyenV2ServiceProxy,
        private _fileService: FileDownloadService,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            maTinh: [''],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DanhMucHuyenPagingListRequest = new DanhMucHuyenPagingListRequest();

        // Add request params
        const formValue = this.rfFormGroup.value;
        input.maTinh = formValue.maTinh;
        input.filter = formValue.filter;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        input.maxResultCount = request.maxResultCount;

        // Call API to fetch data
        this._dataService
            .searchServerPaging(input)
            .pipe(finalize(finishedCallback))
            .subscribe((result) => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    delete(dataItem: DanhMucHuyenDto): void {
        this.message.confirm('', 'Bạn có chắc chắn muốn xóa : ' + dataItem.tenHuyen + '?', (isConfirmed) => {
            if (isConfirmed) {
                this._dataService.delete(dataItem.id).subscribe(() => {
                    this.refresh();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }

    showCreateOrEditModal(dataItem?: DanhMucHuyenDto): void {
        this.modalHelper
            .create(
                CreateOrEditHuyenV2Component,
                { dataItem: dataItem ? dataItem : {} },
                {
                    size: 'md',
                    includeTabs: false,
                    modalOptions: {
                        nzTitle: dataItem ? 'Sửa thông tin huyện' : 'Thêm mới huyện',
                    },
                },
            )
            .subscribe((result) => {
                if (result) {
                    this.refresh();
                }
            });
    }

    ExportDanhSachHuyen(): void {
        const input: ExportDanhSachHuyenRequest = new ExportDanhSachHuyenRequest();
        const formValue = this.rfFormGroup.value;
        input.maTinh = formValue.maTinh;
        input.filter = formValue.filter;

        this._dataService.exportDanhSachHuyen(input).subscribe((result) => {
            this._fileService.downloadTempFile(result);
            this.notify.success('Download thành công');
        });
    }

    onClickUpload(data: any) {
        let input: UploadExcelDanhSachHuyenRequest = new UploadExcelDanhSachHuyenRequest();
        input.listDanhSachHuyen = [];
        if (Array.isArray(data) && typeof data === 'object') {
            for (let item of data) {
                console.log(item);
                let huyen: ImportDanhMucHuyenV2Dto = new ImportDanhMucHuyenV2Dto();
                huyen.tenHuyen = item['Tên Huyện'];
                huyen.tenTinh = item['Tên Tỉnh'];
                huyen.cap = item['Cấp'];
                huyen.tenKhongDau = item['Tên Không Dấu'];
                input.listDanhSachHuyen.push(huyen);
            }
        }

        this._dataService.uploadExcelDanhSachHuyen(input).subscribe((result) => {
            this.notify.success('Import thành công');
        });
    }
}
