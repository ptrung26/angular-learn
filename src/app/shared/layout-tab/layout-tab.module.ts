import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutTabManagerComponent } from '@app/shared/layout-tab/layout-tab-manager/layout-tab-manager.component';
import { LayoutTabContentComponent } from './layout-tab-manager/layout-tab-content/layout-tab-content.component';
import { NzTabsModule } from '@node_modules/ng-zorro-antd/tabs';

import { UtilsModule } from '@shared/utils/utils.module';
import { OraMapModComService } from './ora-map-mod-com.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from '@node_modules/ng-zorro-antd/grid';
import { NzCardModule } from '@node_modules/ng-zorro-antd/card';
import { NzDropDownModule } from '@node_modules/ng-zorro-antd/dropdown';
import { NzButtonModule } from '@node_modules/ng-zorro-antd/button';
import { LayoutTabManagerService } from '@app/shared/layout-tab/layout-tab-manager/layout-tab-manager.service';


@NgModule({
    declarations: [
        LayoutTabManagerComponent,
        LayoutTabContentComponent,
    ],
    exports: [
        LayoutTabManagerComponent,
    ],
    imports: [
        CommonModule,
        NzTabsModule,
        NzLayoutModule,
        UtilsModule,
        NzGridModule,
        NzCardModule,
        NzDropDownModule,
        ReactiveFormsModule,
        NzButtonModule,
    ],
    providers: [OraMapModComService],
})
export class LayoutTabModule {
}
