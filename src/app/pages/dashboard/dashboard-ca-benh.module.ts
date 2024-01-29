import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { SharedModule } from '@shared/shared.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DragDropModule } from '@node_modules/@angular/cdk/drag-drop';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { Routes } from '@angular/router';
import { DashboardCaBenhRoutingModule } from './dashboard-ca-benh-routing.module';
import { DashboardCaBenhComponent } from './dashboard-ca-benh.component';
import { VgbBoYTeComponent } from '@app/pages/dashboard/viem-gan-b/vgb-bo-y-te.component';
import { VgcBoYTeComponent } from '@app/pages/dashboard/viem-gan-c/vgc-bo-y-te.component';
import { VgbSoYTeComponent } from '@app/pages/dashboard/viem-gan-b/vgb-so-y-te.component';
import { VgbCoSoYTeComponent } from '@app/pages/dashboard/viem-gan-b/vgb-co-so-y-te.component';
import { VgcSoYTeComponent } from '@app/pages/dashboard/viem-gan-c/vgc-so-y-te.component';
import { VgcCoSoYTeComponent } from '@app/pages/dashboard/viem-gan-c/vgc-co-so-y-te.component';

@NgModule({
    declarations: [
        DashboardCaBenhComponent,
        VgbBoYTeComponent,
        VgbSoYTeComponent,
        VgbCoSoYTeComponent,
        VgcBoYTeComponent,
        VgcSoYTeComponent,
        VgcCoSoYTeComponent
    ],
    imports: [
        CommonModule,
        DashboardCaBenhRoutingModule,
        CustomizeCompModule,
        SharedModule,
        DataCommonModule,
        UtilsModule,
        DragDropModule,
        AppCommonModule,
    ],
    exports: [],

    providers: [],
})
export class DashboardCaBenhModule {
}
