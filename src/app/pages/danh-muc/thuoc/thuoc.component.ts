import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditThuocComponent } from './create-or-edit.component';
import { DanhMucThuocPagingListRequest, DanhMucThuocServiceProxy, DanhMucThuocDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
    templateUrl: './thuoc.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class ThuocComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        injector: Injector,
        private _dataService: DanhMucThuocServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: ''
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DanhMucThuocPagingListRequest = new DanhMucThuocPagingListRequest();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
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

    showCreateOrEditModal(dataItem?: DanhMucThuocDto): void {
        this.modalHelper.create(CreateOrEditThuocComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: false,
                modalOptions: {

                    nzTitle: dataItem ? 'Sửa thông tin thuốc: ' + dataItem.tenThuoc : 'Thêm mới thuốc',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: DanhMucThuocDto): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa: '+dataItem.tenThuoc+'?',
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
