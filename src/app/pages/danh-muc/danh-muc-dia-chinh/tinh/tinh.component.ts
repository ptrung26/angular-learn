import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditTinhComponent } from './create-or-edit.component';
import { DanhMucTinhPagingListRequest, DanhMucTinhServiceProxy, DanhMucTinhDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
    templateUrl: './tinh.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class TinhComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        injector: Injector,
        private _dataService: DanhMucTinhServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            maTinh: [''],
            maHuyen: [''],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DanhMucTinhPagingListRequest = new DanhMucTinhPagingListRequest();
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

    showCreateOrEditModal(dataItem?: DanhMucTinhDto): void {
        this.modalHelper.create(CreateOrEditTinhComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: false,
                modalOptions: {

                    nzTitle: dataItem ? 'Sửa thông tin Tỉnh/Thành phố: ' + dataItem.tenTinh : 'Thêm mới Tỉnh/Thành phố',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: DanhMucTinhDto): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa: '+ dataItem.tenTinh+'?',
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
