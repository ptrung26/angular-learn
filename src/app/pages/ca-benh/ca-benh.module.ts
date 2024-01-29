import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { SharedModule } from '@shared/shared.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DragDropModule } from '@node_modules/@angular/cdk/drag-drop';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { Routes } from '@angular/router';
import { CaBenhRoutingModule } from './ca-benh-routing.module';
import { CreateOrEditCaBenhComponent } from './danh-sach/create-or-edit-ca-benh.component';
import { CaBenhComponent } from './danh-sach/ca-benh.component';
import { UploadCaBenhModalComponent } from './danh-sach/up-load-ca-benh-modal.component';
import { ViewErrorImportCaBenhComponent } from './danh-sach/view-error.component';
import { BaoCaoCaBenhComponent } from './bao-cao/bao-cao.component';
import { CreateOrEditDieuTriComponent } from '@app/pages/ca-benh/danh-sach/create-or-edit-dieu-tri.component';
import { DuLieuXmlComponent } from '@app/pages/ca-benh/du-lieu-xml/du-lieu-xml.component';
import { CreateOrEditDuLieuXmlComponent } from '@app/pages/ca-benh/du-lieu-xml/create-or-edit-du-lieu-xml.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CaBenhV2Component } from './danh-sach-v2/ca-benh-v2.component';
import { CreateOrUpdateCaBenhV2Component } from './danh-sach-v2/create-or-edit-ca-benh-v2.component';
import { CreateOrEditDieuTriV2Component } from './danh-sach-v2/create-or-edit-dieu-tri-v2.component';
@NgModule({
    declarations: [
        CaBenhComponent,
        CaBenhV2Component,
        CreateOrEditCaBenhComponent,
        CreateOrUpdateCaBenhV2Component,
        CreateOrEditDieuTriComponent,
        CreateOrEditDieuTriV2Component,
        UploadCaBenhModalComponent,
        ViewErrorImportCaBenhComponent,
        BaoCaoCaBenhComponent,
        DuLieuXmlComponent,
        CreateOrEditDuLieuXmlComponent,
    ],
    imports: [
        CommonModule,
        CaBenhRoutingModule,
        CustomizeCompModule,
        SharedModule,
        DataCommonModule,
        UtilsModule,
        DragDropModule,
        AppCommonModule,
        NzTagModule,
    ],
    exports: [],

    providers: [],
})
export class CaBenhModule {}
