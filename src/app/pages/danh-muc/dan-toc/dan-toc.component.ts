import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditDanTocComponent } from './create-or-edit.component';
import { DanhMucDanTocPagingListRequest, DanhMucDanTocServiceProxy, DanhMucDanTocDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
    templateUrl: './dan-toc.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class DanTocComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        injector: Injector,
        private _dataService: DanhMucDanTocServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            maDanToc: [''],
            maHuyen: [''],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DanhMucDanTocPagingListRequest = new DanhMucDanTocPagingListRequest();
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

    showCreateOrEditModal(dataItem?: DanhMucDanTocDto): void {
        this.modalHelper.create(CreateOrEditDanTocComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: false,
                modalOptions: {

                    nzTitle: dataItem ? 'Sửa thông tin Dân tộc: ' + dataItem.ten : 'Thêm mới Dân tộc',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: DanhMucDanTocDto): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa : ' + dataItem.ten + '?',
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
