import { ModalComponentBase } from '@shared/common/modal-component-base';
import { OnInit, Injector, Directive } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    PagedResultDto,
    PagedRequestDto,
} from '@shared/common/paged-listing-component-base';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ModalPagedListingComponentBase<EntityDto> extends ModalComponentBase implements OnInit {
    dataList: EntityDto[] = [];
    public pageSize = AppConsts.grid.defaultPageSize;
    public pageNumber = 1;
    public totalPages = 1;
    public skipCount: number; //
    public totalItems: number;
    public sorting: string = undefined;
    filterText = '';
    public isTableLoading = false;
    public allChecked = false;
    public allCheckboxDisabled = false;
    public checkboxIndeterminate = false;
    public selectedDataItems: any[] = [];

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.pageNumber = 1;
        this.restCheckStatus(this.dataList);
        this.getDataPage(this.pageNumber);
    }

    public showPaging(result: PagedResultDto): void {
        this.totalItems = result.totalCount;
    }

    public getDataPage(page: number): void {
        const req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        this.skipCount = (page - 1) * this.pageSize;
        req.skipCount = this.skipCount;
        req.sorting = this.sorting;

        this.isTableLoading = true;
        this.getDataList(req, page, () => {
            this.isTableLoading = false;
            this.refreshAllCheckBoxDisabled();
        });
    }

    checkAll(value: boolean): void {
        this.dataList.forEach(data => ((<any>data).checked = this.allChecked));
        this.refreshCheckStatus(this.dataList);
    }

    refreshCheckStatus(entityList: any[]): void {
        // check Tất cả
        const allChecked = entityList.every(value => value.checked === true);
        // Check không chọn
        const allUnChecked = entityList.every(value => !value.checked);
        this.allChecked = allChecked;
        // Hộp chọn kiểu hôp
        this.checkboxIndeterminate = !allChecked && !allUnChecked;
        // Dữ liệu đa chọn
        this.selectedDataItems = entityList.filter(value => value.checked);
    }

    restCheckStatus(entityList: any[]): void {
        this.allChecked = false;
        this.checkboxIndeterminate = false;
        // Dữ liệu đa chọn
        this.selectedDataItems = [];
        entityList.forEach(value => (value.checked = false));
    }

    refreshAllCheckBoxDisabled(): void {
        this.allCheckboxDisabled = this.dataList.length <= 0;
    }

    public pageNumberChange(): void {
        if (this.pageNumber > 0) {
            this.restCheckStatus(this.dataList);
            this.getDataPage(this.pageNumber);
        }
    }

    gridSort(sort: { key: string; value: string }) {
        this.sorting = undefined;
        let ascOrDesc = sort.value; // 'ascend' or 'descend' or null
        const filedName = sort.key;
        if (ascOrDesc) {
            ascOrDesc = abp.utils.replaceAll(ascOrDesc, 'end', '');
            const args = ['{0} {1}', filedName, ascOrDesc];
            const sortingStr = abp.utils.formatString.apply(this, args);
            this.sorting = sortingStr;
        }
        this.refresh();
    }

    protected abstract getDataList(
        request: PagedRequestDto,
        pageNumber: number,
        finishedCallback: () => void,
    ): void;
}
