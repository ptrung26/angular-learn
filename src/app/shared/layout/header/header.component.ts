import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { ImpersonationService } from '@app/pages/admin/users/impersonation.service';
import { SettingsService } from '@delon/theme';
import { AbpSessionService } from '@node_modules/abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  searchToggleStatus: boolean;
  isImpersonatedLogin = false;

  constructor(
    injector: Injector,
    public settings: SettingsService,
    private _abpSessionService: AbpSessionService,
    private _impersonationService: ImpersonationService,
  ) { super(injector); }

  toggleCollapsedSidebar() {
    const collapsed = !this.settings.layout.collapsed;
    this.settings.setLayout('collapsed', collapsed);
    abp.event.trigger('abp.theme-setting.collapsed', collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  ngOnInit(): void {
    this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;
  }

  backToMyAccount() {
    this._impersonationService.backToImpersonator();
  }
}
