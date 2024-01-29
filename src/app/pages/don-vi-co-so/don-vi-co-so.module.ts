import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { SharedModule } from '@shared/shared.module';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DragDropModule } from '@node_modules/@angular/cdk/drag-drop';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { Routes } from '@angular/router';
import { CreateOrEditDonViCoSoComponent } from './danh-sach/create-or-edit.component';
import { DonViCoSoComponent } from './danh-sach/don-vi-co-so.component';
import { DonViCoSoRoutingModule } from './don-vi-co-so-routing.module';
import { TaiKhoanCoSoComponent } from './tai-khoan-co-so/tai-khoan-co-so.component';
import { EditDonViCoSoComponent } from './danh-sach/edit-don-vi-co-so.component';
import { CreateOrEditUserCoSoModalComponent } from './tai-khoan-co-so/create-or-edit-user-co-so-modal.component';

@NgModule({
    declarations: [
        DonViCoSoComponent,
        CreateOrEditDonViCoSoComponent,
        EditDonViCoSoComponent,
        TaiKhoanCoSoComponent,
        CreateOrEditUserCoSoModalComponent],
    imports: [
    CommonModule,
    DonViCoSoRoutingModule,
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
export class DonViCoSoModule {
}
