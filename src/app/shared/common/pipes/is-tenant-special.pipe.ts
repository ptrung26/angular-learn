import { Pipe, PipeTransform } from '@angular/core';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Pipe({
    name: 'isTenantSpecial',
})
export class IsTenantSpecialPipe implements PipeTransform {
// Check tenantId truyền vào:
    //return true nếu TenantId truyền vào = Session Tenant ; hoặc tenant hiện tại đang là host
    constructor(private _session: AppSessionService) {

    }

    transform(tenantId: number): boolean {
        if (this._session.tenantId) {
            return tenantId === this._session.tenantId;
        } else {
            return true;
        }
    }

}
