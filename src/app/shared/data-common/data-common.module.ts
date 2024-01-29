import { NgModule } from '@angular/core';
import { TinhComboComponent } from './combobox-filter/tinh-combo.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {NgSelectModule} from '@ng-select/ng-select';
import { HuyenComboComponent } from './combobox-filter/huyen-combo.component';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { XaComboComponent } from './combobox-filter/xa-combo.component';
import { OraSelectComponent } from './combobox-filter/ora-select/ora-select.component';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { OraRadioComponent } from './combobox-filter/ora-select/ora-radio.component';
import { QuocTichComboComponent } from './combobox-filter/quoc-tich-combo.component';
import { CustomSourceDirective } from './combobox-filter/ora-select/directive/customSource.directive';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';
import { NgheNghiepComboComponent } from './combobox-filter/nghe-nghiep-combo.component';
import { DanTocComboComponent } from './combobox-filter/dan-toc-combo.component';
import { GioiTinhDirective } from './combobox-filter/ora-select/directive/gioi-tinh.directive';
import { UserLevelDirective } from './combobox-filter/ora-select/directive/user-level.directive';
import { AllUserLevelDirective } from './combobox-filter/ora-select/directive/all-user-level.directive';
import { DonViCoSoComboComponent } from './combobox-filter/don-vi-co-so-combo.component';
import { KetQuaDieuTriDirective } from './combobox-filter/ora-select/directive/ket-qua-dieu-tri.directive';
import { KetQuaXetNghiemDirective } from './combobox-filter/ora-select/directive/ket-qua-xet-nghiem.directive';
import { NhomBenhDirective } from './combobox-filter/ora-select/directive/nhom-benh.directive';
import { NhomNguongDirective } from './combobox-filter/ora-select/directive/nhom-nguong.directive';
import { NhomThuocDirective } from './combobox-filter/ora-select/directive/nhom-thuoc.directive';
import { NhomXetNghiemNhieuLanDirective } from './combobox-filter/ora-select/directive/nhom-xet-nghiem-nhieu-lan.directive';
import { DonViChiSoDirective } from './combobox-filter/ora-select/directive/don-vi-chi-so.directive';
import { AllKetQuaXetNghiemDirective } from './combobox-filter/ora-select/directive/all-ket-qua-xet-nghiem.directive';
import { DonViCoSoDirective } from './combobox-filter/ora-select/directive/don-vi-co-so.directive';
import { BaoHiemYTeDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/bao-hiem-y-te.directive';
import { BenhVienComboComponent } from '@app/shared/data-common/combobox-filter/benh-vien-combo.component';
import { CoSoLevelDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/coso-level.directive';
import { NhiemHIVDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/nhiem-hiv.directive';
import { TuVongDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/tu-vong.directive';
import { DonViXetNghiemDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/don-vi-xet-nghiem.directive';
import { KieuGenDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/keu-gen.directive';
import { NhomDichVuDirective } from '@app/shared/data-common/combobox-filter/ora-select/directive/nhom-dich-vu.directive';

const componentsEx = [
    OraSelectComponent,
    OraRadioComponent,
    TinhComboComponent,
    HuyenComboComponent,
    XaComboComponent,
    QuocTichComboComponent,
    NgheNghiepComboComponent,
    DanTocComboComponent,
    DonViCoSoComboComponent,
    BenhVienComboComponent,
    DonViCoSoDirective,
    CustomSourceDirective,
    GioiTinhDirective,
    UserLevelDirective,
    CoSoLevelDirective,
    AllUserLevelDirective,
    KetQuaDieuTriDirective,
    KetQuaXetNghiemDirective,
    AllKetQuaXetNghiemDirective,
    NhomBenhDirective,
    BaoHiemYTeDirective,
    NhiemHIVDirective,
    TuVongDirective,
    NhomNguongDirective,
    NhomThuocDirective,
    NhomXetNghiemNhieuLanDirective,
    DonViChiSoDirective,
    DonViXetNghiemDirective,
    KieuGenDirective,
    NhomDichVuDirective
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...SHARED_ZORRO_MODULES,
        CustomizeCompModule,
    ],
    declarations: [...componentsEx],
    exports: [...componentsEx],
    providers: [DataCommonService],
})
export class DataCommonModule {
}
