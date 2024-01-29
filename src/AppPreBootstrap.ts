import { DateTime, Settings } from 'luxon';
import { merge as _merge } from 'lodash-es';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Type, CompilerOptions, NgModuleRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { environment } from '@env/environment';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
import { XmlHttpRequestHelper } from '@shared/helpers/XMLHttpRequestHelper';
import { LocaleMappingService } from '@shared/locale-mapping.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { UtilsService } from '@node_modules/abp-ng2-module';

export class AppPreBootstrap {
    static run(appRootUrl: string, callback: () => void): void {
        AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
            // AppPreBootstrap.getUserConfiguration(callback);
            const queryStringObj = UrlHelper.getQueryParameters();

            if (queryStringObj.redirect && queryStringObj.redirect === 'TenantRegistration') {
                if (queryStringObj.forceNewRegistration) {
                    new AppAuthService().logout();
                }

                location.href = AppConsts.appBaseUrl + '/account/select-edition';
            } else if (queryStringObj.impersonationToken) {
                AppPreBootstrap.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => {
                    AppPreBootstrap.getUserConfiguration(callback);
                });
            } else if (queryStringObj.switchAccountToken) {
                AppPreBootstrap.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => {
                    AppPreBootstrap.getUserConfiguration(callback);
                });
            } else {
                AppPreBootstrap.getUserConfiguration(callback);
            }

        });
    }

    private static impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie(),
        };

        XmlHttpRequestHelper.ajax(
            'POST',
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
            requestHeaders,
            null,
            (response) => {
                let result = response.result;
                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            },
        );
    }

    private static setEncryptedTokenCookie(encryptedToken: string) {
        new UtilsService().setCookieValue(AppConsts.authorization.encrptedAuthTokenName,
            encryptedToken,
            new Date(new Date().getTime() + 365 * 86400000), //1 year
            abp.appPath,
        );
    }

    private static linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie(),
        };

        XmlHttpRequestHelper.ajax(
            'POST',
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
            requestHeaders,
            null,
            (response) => {
                let result = response.result;
                abp.auth.setToken(result.accessToken);
                AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            },
        );
    }


    static bootstrap<TM>(
        moduleType: Type<TM>,
        compilerOptions?: CompilerOptions | CompilerOptions[],
    ): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(
            moduleType,
            compilerOptions,
        );
    }

    private static getApplicationConfig(appRootUrl: string, callback: () => void) {
        let type = 'GET';
        let url = appRootUrl + 'assets/' + environment.appConfig;
        let customHeaders = [
            {
                name: abp.multiTenancy.tenantIdCookieName,
                value: abp.multiTenancy.getTenantIdCookie() + '',
            }];

        XmlHttpRequestHelper.ajax(type, url, customHeaders, null, (result) => {
            const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
            const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

            AppConsts.appBaseUrlFormat = result.appBaseUrl;
            AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
            AppConsts.localeMappings = result.localeMappings;

            if (tenancyName == null) {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
            } else {
                AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
                AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
            }

            callback();
        });
    }

    private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    private static getUserConfiguration(callback: () => void): any {
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        const token = abp.auth.getToken();

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie(),
        };

        if (!cookieLangValue) {
            delete requestHeaders['.AspNetCore.Culture'];
        }

        if (token) {
            requestHeaders['Authorization'] = 'Bearer ' + token;
        }

        return XmlHttpRequestHelper.ajax('GET', AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', requestHeaders, null, (response) => {
            let result = response.result;
            _merge(abp, result);

            abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

            AppPreBootstrap.configureLuxon();

            abp.event.trigger('abp.dynamicScriptsInitialized');

            callback();
        });
    }

    private static configureLuxon() {
        let luxonLocale = new LocaleMappingService().map(
            'luxon',
            abp.localization.currentLanguage.name,
        );
        Settings.defaultLocale = luxonLocale;
        // DateTime.local().setLocale(luxonLocale);
        // DateTime.utc().setLocale(luxonLocale);

        if (abp.clock.provider.supportsMultipleTimezone) {
            Settings.defaultZoneName = abp.timing.timeZoneInfo.iana.timeZoneId;
        }

        Date.prototype.toISOString = function() {
            let value = DateTime.fromJSDate(this).setLocale('en').setZone(abp.timing.timeZoneInfo.iana.timeZoneId).toString();
            return value;
        };

        Date.prototype.toString = function() {
            let value = DateTime.fromJSDate(this).setLocale('en').setZone(abp.timing.timeZoneInfo.iana.timeZoneId).toString();
            return value;
        };
    }
}
