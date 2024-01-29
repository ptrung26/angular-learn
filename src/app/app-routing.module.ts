import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { AppComponent } from '@app/app.component';
import { NotificationsComponent } from '@app/shared/layout/notifications/notifications.component';

const routes: Routes = [
    {
        path: 'app',
        component: AppComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'notifications', component: NotificationsComponent },
                    { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' },
                ],
            },
            {
                path: 'main',
                loadChildren: () => import('./main/main.module').then(m => m.MainModule), // Lazy load main module
                data: { preload: true },
            },
            {
                path: 'admin',
                loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: 'danh-muc',
                loadChildren: () => import('./pages/danh-muc/danh-muc.module').then(m => m.DanhMucModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: 'don-vi-co-so',
                loadChildren: () => import('./pages/don-vi-co-so/don-vi-co-so.module').then(m => m.DonViCoSoModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: 'quan-ly-ca-benh',
                loadChildren: () => import('./pages/ca-benh/ca-benh.module').then(m => m.CaBenhModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            {
                path: 'dashboard-ca-benh',
                loadChildren: () => import('./pages/dashboard/dashboard-ca-benh.module').then(m => m.DashboardCaBenhModule), // Lazy load admin module
                data: { preload: true },
                canLoad: [AppRouteGuard],
            },
            { path: '**', redirectTo: '/app/dashboard-ca-benh' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor(
        private router: Router,
    ) {

    }
}
