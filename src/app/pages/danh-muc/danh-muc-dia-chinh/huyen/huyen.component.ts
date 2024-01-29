import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditHuyenComponent } from './create-or-edit.component';
import { DanhMucHuyenPagingListRequest, DanhMucHuyenServiceProxy,DanhMucHuyenDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
    templateUrl: './huyen.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class HuyenComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        injector: Injector,
        private _dataService: DanhMucHuyenServiceProxy,
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
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.maTinh = formValue.maTinh;
        this._dataService.searchServerPaging(input)
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    clear() {
        this.rfFormGroup.reset();
        this.refresh();
    }

    showCreateOrEditModal(dataItem?: DanhMucHuyenDto): void {
        this.modalHelper.create(CreateOrEditHuyenComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: false,
                modalOptions: {

                    nzTitle: dataItem ? 'Sửa thông tin Quận/Huyện: ' + dataItem.tenHuyen : 'Thêm mới Quận/Huyện',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: DanhMucHuyenDto): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa : '+dataItem.tenHuyen+'?',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._dataService.delete(dataItem.id)
                        .subscribe(() => {
                            this.refresh();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }


}
