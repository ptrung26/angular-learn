import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanTocComponent } from './dan-toc/dan-toc.component';
import { HuyenComponent } from './danh-muc-dia-chinh/huyen/huyen.component';
import { TinhComponent } from './danh-muc-dia-chinh/tinh/tinh.component';
import { XaComponent } from './danh-muc-dia-chinh/xa/xa.component';
import { NgheNghiepComponent } from './nghe-nghiep/nghe-nghiep.component';
import { ThuocComponent } from './thuoc/thuoc.component';
import { DichVuComponent } from '@app/pages/danh-muc/dich-vu/dich-vu.component';
import { HuyenV2ComponentApp } from './danh-muc-dia-chinh/huyen-v2/huyen-v2.component';
const routes: Routes = [
    { path: 'tinh', component: TinhComponent, data: { permission: 'Pages.DanhMuc.Tinh' } },
    { path: 'huyen', component: HuyenComponent, data: { permission: 'Pages.DanhMuc.Huyen' } },
    { path: 'huyen-v2', component: HuyenV2ComponentApp, data: { permission: 'Pages.DanhMuc.Huyen' } },
    { path: 'xa', component: XaComponent, data: { permission: 'Pages.DanhMuc.Xa' } },
    { path: 'dan-toc', component: DanTocComponent, data: { permission: 'Pages.DanhMuc.DanToc' } },
    { path: 'nghe-nghiep', component: NgheNghiepComponent, data: { permission: 'Pages.DanhMuc.NgheNghiep' } },
    { path: 'thuoc', component: ThuocComponent, data: { permission: 'Pages.DanhMuc.Thuoc' } },
    { path: 'dich-vu', component: DichVuComponent, data: { permission: 'Pages.DanhMuc.Thuoc' } },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucRoutingModule {}
