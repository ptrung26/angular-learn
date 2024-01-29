import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector, OnInit, Directive } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

export class PagedResultDto {
    items: any[];
    totalCount: number;
}

export class EntityDto {
    id: number;
}

export class PagedRequestDto {
    skipCount: number;
    maxResultCount: number;
    sorting: string;
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class PagedListingComponentBase<EntityDto> extends AppComponentBase implements OnInit {
    public pageSize = AppConsts.grid.defaultPageSize;
    public pageNumber = 1;
    public totalPages = 1;
    public skipCount: number; //
    public totalItems: number;
    public isTableLoading = true;
    public allChecked = false;
    public allCheckboxDisabled = false;
    public checkboxIndeterminate = false;
    public selectedDataItems: any[] = [];
    public sorting: string = undefined;
    filterText = '';
    dataList: EntityDto[] = [];

    public booleanFilterList: any[] = [
        { text: this.l('All'), value: 'All' },
        { text: this.l('Yes'), value: true },
        { text: this.l('No'), value: false },
    ];

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

    /**
     * Fetch DATA
     * @param page
     */
    public getDataPage(page: number): void {
        const req = new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        this.skipCount = (page - 1) * this.pageSize;
        req.skipCount = this.skipCount;
        req.sorting = this.sorting;
        this.isTableLoading = true;
        this.fetchDataList(req, page, () => {
            this.isTableLoading = false;
            // cập nhật trạng thái disable
            this.refreshAllCheckBoxDisabled();
        });
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

    checkAll(value: boolean): void {
        this.dataList.forEach((data) => ((<any>data).checked = this.allChecked));
        this.refreshCheckStatus(this.dataList);
    }

    refreshCheckStatus(entityList: any[]): void {
        // Chọn tất cả
        const allChecked = entityList.every((value) => value.checked === true);
        // bỏ chọn tất cả
        const allUnChecked = entityList.every((value) => !value.checked);
        this.allChecked = allChecked;
        // Kiểu hộp chọn
        this.checkboxIndeterminate = !allChecked && !allUnChecked;
        // Dữ liệu đã chọn
        this.selectedDataItems = entityList.filter((value) => value.checked);
    }

    restCheckStatus(entityList: any[]): void {
        this.allChecked = false;
        this.checkboxIndeterminate = false;
        // Dữ liệu đã chọn
        this.selectedDataItems = [];
        entityList.forEach((value) => (value.checked = false));
    }

    public showPaging(result: PagedResultDto): void {
        this.totalItems = result.totalCount;
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

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }
        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Fetch data
     * @param request
     * @param pageNumber
     * @param finishedCallback
     */
    protected abstract fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void;
}
