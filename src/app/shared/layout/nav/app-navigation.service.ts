import { FeatureCheckerService, PermissionCheckerService } from 'abp-ng2-module';

import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';
import { Menu, MenuService } from '@delon/theme';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Injectable()
export class AppNavigationService {
    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _featureCheckerService: FeatureCheckerService,
        private _appSessionService: AppSessionService,
        private _localizationService: AppLocalizationService,
        private _ngAlainMenuService: MenuService,
    ) {}

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            // new AppMenuItem('Notifications', 'Pages.Notifications', 'bell', '/app/notifications'),
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'dashboard', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'dashboard', '/app/main/dashboard'),
            // new AppMenuItem('Tenants', 'Pages.Tenants', 'bars', '/app/admin/tenants'),
            // new AppMenuItem('Editions', 'Pages.Editions', 'shopping', '/app/admin/editions'),
            new AppMenuItem('Dashboard', 'Pages.Dashboard', 'dashboard', '/app/dashboard-ca-benh'),
            new AppMenuItem('Quản lý ca bệnh', 'Pages.CaBenh', 'team', '', [
                new AppMenuItem('Danh sách ca bệnh', 'Pages.CaBenh.DanhSach', 'bars', '/app/quan-ly-ca-benh/danh-sach'),
                new AppMenuItem('Danh sách ca bệnh V2', 'Pages.CaBenh.DanhSach', 'bars', '/app/quan-ly-ca-benh/danh-sach-v2'),
                new AppMenuItem('Dữ liệu liên thông', 'Pages.DuLieuXML.DanhSach', 'bars', '/app/quan-ly-ca-benh/du-lieu-lien-thong'),
                new AppMenuItem('Báo cáo ca bệnh', 'Pages.CaBenh.BaoCao', 'bar-chart', '/app/quan-ly-ca-benh/bao-cao'),
            ]),

            new AppMenuItem('Danh mục', 'Pages.DanhMuc', 'bars', '', [
                new AppMenuItem('Tỉnh', 'Pages.DanhMuc.Tinh', 'ordered-list', '/app/danh-muc/tinh'),
                new AppMenuItem('Huyện', 'Pages.DanhMuc.Huyen', 'ordered-list', '/app/danh-muc/huyen'),
                new AppMenuItem('Xã', 'Pages.DanhMuc.Xa', 'ordered-list', '/app/danh-muc/xa'),
                new AppMenuItem('Dân tộc', 'Pages.DanhMuc.DanToc', 'ordered-list', '/app/danh-muc/dan-toc'),
                new AppMenuItem('Nghề nghiệp', 'Pages.DanhMuc.NgheNghiep', 'ordered-list', '/app/danh-muc/nghe-nghiep'),
                new AppMenuItem('Thuốc', 'Pages.DanhMuc.Thuoc', 'ordered-list', '/app/danh-muc/thuoc'),
                new AppMenuItem('Dịch vụ', 'Pages.DanhMuc.Thuoc', 'ordered-list', '/app/danh-muc/dich-vu'),
                new AppMenuItem('Huyện V2', 'Pages.DanhMuc.Huyen', 'ordered-list', '/app/danh-muc/huyen-v2'),
            ]),

            new AppMenuItem('Administration', 'Pages.Administration', 'appstore', '', [
                new AppMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'team', '/app/admin/organization-units'),
                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'safety', '/app/admin/roles'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'user', '/app/admin/users'),
                new AppMenuItem('Languages', 'Pages.Administration.Languages', 'global', '/app/admin/languages'),
                new AppMenuItem('LanguageTexts', 'Pages.Administration.LanguageTexts', 'global', '/app/admin/languagetexts'),
                new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'book', '/app/admin/auditLogs'),
                new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'lock', '/app/admin/maintenance'),
                // new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
                // new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
                new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'setting', '/app/admin/hostSettings'),
                new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'setting', '/app/admin/tenantSettings'),
            ]),
            new AppMenuItem('Đơn vị cơ sở', 'Pages.DonViCoSo', 'home', '', [
                new AppMenuItem('Danh sách cơ sở', 'Pages.DonViCoSo.DanhSach', 'bars', '/app/don-vi-co-so/danh-sach'),
                new AppMenuItem('Tài khoản cơ sở', 'Pages.DonViCoSo.TaiKhoan', 'user', '/app/don-vi-co-so/tai-khoan'),
            ]),
        ]);
    }

    mapToNgAlainMenu() {
        let menu = this.getMenu();
        let ngAlainRootMenu = <Menu>{
            text: this._localizationService.l(menu.name),
            group: false,
            hideInBreadcrumb: true,
            children: [],
        };
        this.generateNgAlainMenus(ngAlainRootMenu.children, menu.items);

        let ngAlainMenus = [ngAlainRootMenu];
        this._ngAlainMenuService.add(ngAlainMenus);
    }

    generateNgAlainMenus(ngAlainMenus: Menu[], appMenuItems: AppMenuItem[]) {
        appMenuItems.forEach((item) => {
            let ngAlainMenu: Menu;

            ngAlainMenu = {
                text: this._localizationService.l(item.name),
                link: item.route,
                icon: { type: 'icon', value: item.icon },
                hide: !this.showMenuItem(item),
            };

            if (item.items && item.items.length > 0) {
                ngAlainMenu.children = [];
                this.generateNgAlainMenus(ngAlainMenu.children, item.items);
            }

            ngAlainMenus.push(ngAlainMenu);
        });
    }

    checkChildMenuItemPermission(menuItem): boolean {
        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (
            menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' &&
            this._appSessionService.tenant &&
            !this._appSessionService.tenant.edition
        ) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
            hideMenuItem = true;
        }

        if (hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }
}
