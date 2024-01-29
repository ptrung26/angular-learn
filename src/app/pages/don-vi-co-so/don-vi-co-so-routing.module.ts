import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonViCoSoComponent } from './danh-sach/don-vi-co-so.component';
import { TaiKhoanCoSoComponent } from './tai-khoan-co-so/tai-khoan-co-so.component';

const routes: Routes = [
    {
        path: 'danh-sach',
        component: DonViCoSoComponent,
        data: { permission: 'Pages.DonViCoSo.DanhSach' }
    },
    {
        path: 'tai-khoan',
        component: TaiKhoanCoSoComponent,
        data: { permission: 'Pages.DonViCoSo.TaiKhoan' }
    },
    {
        path: 'thong-tin',
        component: DonViCoSoComponent,
        data: { }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DonViCoSoRoutingModule {
}
