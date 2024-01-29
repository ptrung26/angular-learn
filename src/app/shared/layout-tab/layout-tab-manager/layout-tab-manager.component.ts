import {Component, Injector, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {LayoutTabManagerService} from './layout-tab-manager.service';
import {Observable, Subject} from 'rxjs';
import {TabDataType} from './TabDataType';
import {AppComponentBase} from '@shared/common/app-component-base';
import {delay, take, takeUntil} from '@node_modules/rxjs/internal/operators';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
    selector: 'layout-tab-manager',
    templateUrl: './layout-tab-manager.component.html',
    styleUrls: ['./layout-tab-manager.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class LayoutTabManagerComponent implements OnInit, OnDestroy {
    // index = 0;
    curentTab = 0;
    $destroy = new Subject<boolean>();
    $listTab: Observable<TabDataType[]> = this.tabService.$listTab;
    constructor(
        private tabService: LayoutTabManagerService,
        private nzContextMenuService: NzContextMenuService
    ) {
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }

    ngOnInit(): void {
        this.tabService.$currentTabIndex.pipe(takeUntil(this.$destroy), delay(100)).subscribe(result => this.curentTab = result);
    }


    changeTab($event: number) {
        this.tabService.changeTab($event);
    }

    closeTab(index: number) {
        this.tabService.closeTab(index);
    }

    contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent) {
        this.nzContextMenuService.create($event, menu);
    }

    closeOtherTab(i: number) {
        this.tabService.closeOtherTab(i);
    }

    closeAllTab() {
        this.tabService.closeAllTab();
    }

    closeTabRight(i: number) {
        this.tabService.closeTabRight(i);
    }
}
