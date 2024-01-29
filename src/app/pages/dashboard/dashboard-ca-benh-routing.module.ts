import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardCaBenhComponent } from './dashboard-ca-benh.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardCaBenhComponent,
        data: { permission: 'Pages.Dashboard' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardCaBenhRoutingModule {
}
