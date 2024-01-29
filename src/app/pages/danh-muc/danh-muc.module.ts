import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@shared/utils/utils.module';
import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { SharedModule } from '@shared/shared.module';
import { LayoutTabManagerService } from '@app/shared/layout-tab/layout-tab-manager/layout-tab-manager.service';
import { LayoutTabModule } from '@app/shared/layout-tab/layout-tab.module';
import { OraMapModComService } from '@app/shared/layout-tab/ora-map-mod-com.service';
import { TinhComponent } from './danh-muc-dia-chinh/tinh/tinh.component';
import { HuyenComponent } from './danh-muc-dia-chinh/huyen/huyen.component';
import { HuyenV2ComponentApp } from './danh-muc-dia-chinh/huyen-v2/huyen-v2.component';
import { XaComponent } from './danh-muc-dia-chinh/xa/xa.component';
import { CreateOrEditTinhComponent } from './danh-muc-dia-chinh/tinh/create-or-edit.component';
import { CreateOrEditHuyenComponent } from './danh-muc-dia-chinh/huyen/create-or-edit.component';
import { CreateOrEditXaComponent } from './danh-muc-dia-chinh/xa/create-or-edit.component';
import { CreateOrEditDanTocComponent } from './dan-toc/create-or-edit.component';
import { DanTocComponent } from './dan-toc/dan-toc.component';
import { NgheNghiepComponent } from './nghe-nghiep/nghe-nghiep.component';
import { CreateOrEditNgheNghiepComponent } from './nghe-nghiep/create-or-edit.component';
import { ThuocComponent } from './thuoc/thuoc.component';
import { CreateOrEditThuocComponent } from './thuoc/create-or-edit.component';
import { DichVuComponent } from '@app/pages/danh-muc/dich-vu/dich-vu.component';
import { CreateOrEditDichVuComponent } from '@app/pages/danh-muc/dich-vu/create-or-edit.component';
import CreateOrEditHuyenV2Component from './danh-muc-dia-chinh/huyen-v2/create-or-edit.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        DanhMucRoutingModule,
        DataCommonModule,
        CustomizeCompModule,
        SharedModule,
        LayoutTabModule,
    ],
    declarations: [
        TinhComponent,
        CreateOrEditTinhComponent,
        HuyenComponent,
        HuyenV2ComponentApp,
        CreateOrEditHuyenV2Component,
        CreateOrEditHuyenComponent,
        XaComponent,
        CreateOrEditXaComponent,
        DanTocComponent,
        CreateOrEditDanTocComponent,
        NgheNghiepComponent,
        CreateOrEditNgheNghiepComponent,
        ThuocComponent,
        CreateOrEditThuocComponent,
        DichVuComponent,
        CreateOrEditDichVuComponent,
    ],
    providers: [OraMapModComService, LayoutTabManagerService],
})
export class DanhMucModule {}
