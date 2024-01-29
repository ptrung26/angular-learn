import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    DanhMucDichVuDto,
    DanhMucDichVuPagingListRequest,
    DanhMucDichVuServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { CreateOrEditDichVuComponent } from '@app/pages/danh-muc/dich-vu/create-or-edit.component';

@Component({
    templateUrl: './dich-vu.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class DichVuComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        injector: Injector,
        private _dataService: DanhMucDichVuServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    clear() {
        this.rfFormGroup.reset();
        this.refresh();
    }

    showCreateOrEditModal(dataItem?: DanhMucDichVuDto): void {
        this.modalHelper.create(CreateOrEditDichVuComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'lg', includeTabs: false,
                modalOptions: {

                    nzTitle: dataItem ? 'Sửa thông tin dịch vụ: ' + dataItem.tenDichVu : 'Thêm mới dịch vụ',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: DanhMucDichVuDto): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa: ' + dataItem.tenDichVu + '?',
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

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DanhMucDichVuPagingListRequest = new DanhMucDichVuPagingListRequest();
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


}
