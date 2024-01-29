import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaoCaoCaBenhComponent } from './bao-cao/bao-cao.component';
import { CaBenhComponent } from './danh-sach/ca-benh.component';
import { DuLieuXmlComponent } from '@app/pages/ca-benh/du-lieu-xml/du-lieu-xml.component';
import { CaBenhV2Component } from './danh-sach-v2/ca-benh-v2.component';

const routes: Routes = [
    {
        path: 'danh-sach',
        component: CaBenhComponent,
        data: { permission: 'Pages.CaBenh.DanhSach' },
    },
    {
        path: 'danh-sach-v2',
        component: CaBenhV2Component,
        data: { permission: 'Pages.CaBenh.DanhSach' },
    },
    {
        path: 'bao-cao',
        component: BaoCaoCaBenhComponent,
        data: { permission: 'Pages.CaBenh.BaoCao' },
    },
    {
        path: 'du-lieu-lien-thong',
        component: DuLieuXmlComponent,
        data: { permission: 'Pages.DuLieuXML.DanhSach' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CaBenhRoutingModule {}
