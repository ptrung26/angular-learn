import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    AfterViewInit,
} from '@angular/core';

import { AppConsts } from '@shared/AppConsts';

import { filter as _filter, map as _map } from 'lodash-es';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import {
    IOrganizationUnitsTreeComponentData,
    OrganizationUnitsTreeComponent,
} from '@app/pages/admin/shared/organization-unit-tree/organization-unit-tree.component';
import {
    UserRoleDto,
    OrganizationUnitDto,
    UserEditDto,
    UserServiceProxy,
    CreateOrUpdateUserInput,
    ProfileServiceProxy,
    DonViCoSoServiceProxy,
    PasswordComplexitySetting,
    USER_LEVEL,
} from '@shared/service-proxies/service-proxies';
import { TokenService } from 'abp-ng2-module';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styleUrls: ['./create-or-edit-user-modal.component.less'],
})
export class CreateOrEditUserModalComponent extends ModalComponentBase implements OnInit, AfterViewInit {
    @ViewChild('organizationUnitTree', { static: true })
    organizationUnitTree: OrganizationUnitsTreeComponent;

    saving = false;
    userId?: number;
    canChangeUserName = true;
    sendActivationEmail = true;
    allOrganizationUnits: OrganizationUnitDto[];
    setRandomPassword = false;
    memberedOrganizationUnits: string[];
    isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    passwordComplexityInfo = '';
    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    userPasswordRepeat = '';
    tinhs = [];
    enumUserLevel = USER_LEVEL;
    profilePicture: string;

    allUserLevel = [
        { id: 0, name: 'SA' },
        { id: 1, name: 'Bộ y tế' },
        { id: 2, name: 'Quản lý vùng' },
        { id: 3, name: 'Sở y tế' },
        { id: 4, name: 'Đơn vị cơ sở' },
    ];
    allDonViCoSo = [];
    enableTab = true;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _userService: UserServiceProxy,
        private _tokenService: TokenService,
        private _donViCoSoService: DonViCoSoServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (!this.userId) {
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
        }
        this.init();
    }

    ngAfterViewInit(): void {
    }

    init(): void {
        this._userService.getUserForEdit(this.userId).subscribe(result => {
            this.user = result.user;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.roles = result.roles;
            this.tinhs = result.tinhs;
            this.allOrganizationUnits = result.allOrganizationUnits;
            this.memberedOrganizationUnits = result.memberedOrganizationUnits;

            this.getProfilePicture(this.userId);

            if (this.userId) {
                setTimeout(() => {
                    this.setRandomPassword = false;
                }, 0);
                this.sendActivationEmail = false;
            }

            this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
            });
            if (this.user.level == this.enumUserLevel.QUAN_LY_VUNG) {
                this.enableTab = false;
            }
            this.setOrganizationUnitTreeData();
        });
        this.allListDonViCoSo();
    }

    allListDonViCoSo(): void {
        this._donViCoSoService.comboBoxIntData(this.user.level, '').subscribe(result => {
            this.allDonViCoSo = result;
        });
    }

    changeLevel($event): void {
        this.allListDonViCoSo();
        if (this.user.level === this.enumUserLevel.QUAN_LY_VUNG) {
            this.enableTab = false;
        } else {
            this.enableTab = true;
        }
    }

    getProfilePicture(userId: number): void {
        if (!userId) {
            this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            return;
        }
        this._profileService.getProfilePictureByUser(userId).subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            }
        });
    }

    setOrganizationUnitTreeData(): any {
        this.organizationUnitTree.data = <IOrganizationUnitsTreeComponentData>{
            allOrganizationUnits: this.allOrganizationUnits,
            selectedOrganizationUnits: this.memberedOrganizationUnits,
        };
    }

    save(): void {
        const input = new CreateOrUpdateUserInput();
        input.user = this.user;
        input.user.jsonTinhQuanLy = JSON.stringify(this.tinhs);
        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames = _map(
            _filter(this.roles, { isAssigned: true }), role => role.roleName,
        );
        input.organizationUnits = this.organizationUnitTree.getSelectedOrganizations();
        this.saving = true;
        this._userService
            .createOrUpdateUser(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.userPasswordRepeat = '';
                this.success();
            });
    }

    isEdit(): boolean {
        return this.userId !== -1;
    }

    getAssignedRoleCount(): number {
        return _filter(this.roles, { isAssigned: true }).length;
    }
}
