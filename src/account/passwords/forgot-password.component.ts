import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
    AccountServiceProxy,
    SendPasswordResetCodeInput,
} from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent extends AppComponentBase {
    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();

    saving = false;
    checkEmail = true;
    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _router: Router,
    ) {
        super(injector);
    }

    save(): void {
        this.saving = true;
        this.saving = true;
        this._accountService
            .sendPasswordResetCode(this.model)
            .pipe(
                finalize(() => {
                    this.saving = false;
                }),
            )
            .subscribe(() => {
                this.message
                    .success(this.l('PasswordResetMailSentMessage'), this.l('MailSent'))
                    .then(() => {
                        this._router.navigate(['account/login']);
                    });
            });
    }
    changeEmail($event): void {
        this.checkEmail = false;
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(this.model.emailAddress != null && re.test(this.model.emailAddress)){
            this.checkEmail = true;
        }
    }
}
