import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditDonViCoSoComponent } from './create-or-edit.component';
import { DonViCoSoPagingListRequest, DonViCoSoServiceProxy, USER_LEVEL } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
    templateUrl: './don-vi-co-so.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class DonViCoSoComponent extends PagedListingComponentBase<any> implements OnInit {
    rfFormGroup: FormGroup;
    userLevel = USER_LEVEL;

    constructor(
        injector: Injector,
        private _dataService: DonViCoSoServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            maTinh: [''],
            maHuyen: [''],
            maXa: [''],
            level: [0],
            isActive: [true],
        });
    }

    ngOnInit(): void {
        if (this.appSession.user.level == this.userLevel.SO_Y_TE) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
        }
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DonViCoSoPagingListRequest = new DonViCoSoPagingListRequest();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.maTinh = formValue.maTinh;
        input.maHuyen = formValue.maHuyen;
        input.maXa = formValue.maXa;
        input.level = formValue.level;
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

    showCreateOrEditModal(dataItem?: any): void {
        this.modalHelper.create(CreateOrEditDonViCoSoComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: false,
                modalOptions: {

                    nzTitle: dataItem ? 'Sửa thông tin Đơn vị cơ sở: ' + dataItem.tenCoSo : 'Thêm mới Đơn vị cơ sở',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: any): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa: ' + dataItem.tenCoSo + '?',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._dataService.delete(dataItem.id)
                        .subscribe(() => {
                            this.refresh();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                    this.notify.success(this.l('SuccessfullyDeleted'));
                }
            },
        );
    }


}
