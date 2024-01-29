import {
    Component,
    OnInit,
    ElementRef,
    Renderer2,
    Inject,
    OnDestroy,
    ComponentFactoryResolver,
    ViewContainerRef,
    ViewChild,
    NgZone,
} from '@angular/core';
import { SignalRHelper } from '@shared/helpers/SignalRHelper';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationError, NavigationCancel, RouteConfigLoadStart } from '@angular/router';
import { TitleService, SettingsService, ScrollService } from '@delon/theme';
import { DOCUMENT } from '@angular/common';
import { updateHostClass } from '@delon/util';
import { Subject, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { SettingDrawerComponent } from '@app/shared/layout/setting-drawer/setting-drawer.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { debounceTime, distinctUntilChanged, takeUntil } from '@node_modules/rxjs/internal/operators';

@Component({
    selector: 'app-app',
    templateUrl: './app.component.html',
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    private notify$: Subscription;
    isFetching = false;
    $isFetching = new Subject<boolean>();
    $destroy = new Subject<boolean>();
    @ViewChild('settingHost', { read: ViewContainerRef, static: true })
    settingHost: ViewContainerRef;
    installationMode = true;
    IsSessionTimeOutEnabled: boolean = this.setting.getBoolean('App.UserManagement.SessionTimeOut.IsEnabled') && this.appSession.userId != null;

    constructor(
        injector: Injector,
        private settings: SettingsService,
        private router: Router,
        scroll: ScrollService,
        private titleSrv: TitleService,
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private doc: any,
        public _zone: NgZone,
        private resolver: ComponentFactoryResolver,
        _appNavigationService: AppNavigationService,
    ) {
        super(injector);

        _appNavigationService.mapToNgAlainMenu();

        // scroll to top in change page
        router.events.subscribe(evt => {
            if (!this.isFetching && evt instanceof RouteConfigLoadStart) {

                // this.isFetching = true;
                this.$isFetching.next(true);
            }
            if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
                // this.isFetching = false;
                this.$isFetching.next(false);
                return;
            }
            if (evt instanceof NavigationEnd) {
                this.titleSrv.suffix = 'HỆ THỐNG QUẢN LÝ SỐ LIỆU VIÊM GAN VI RÚT B VÀ C';
                this.titleSrv.setTitle();
            }
            scroll.scrollToTop();
            this.$isFetching.next(false);
            // setTimeout(() => {
            //     scroll.scrollToTop();
            //     this.isFetching = false;
            // }, 100);
        });

    }

    private setClass() {
        const { el, doc, renderer, settings } = this;
        const layout = settings.layout;
        updateHostClass(
            el.nativeElement,
            renderer,
            {
                ['alain-default']: true,
                [`alain-default__fixed`]: layout.fixed,
                [`alain-default__collapsed`]: layout.collapsed,
            },
            true,
        );

        doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
    }

    ngOnInit(): void {
        this.registerEvents();

        this.installationMode = UrlHelper.isInstallUrl(location.href);

        if (this.appSession.application) {
            // SignalRHelper.initSignalR(() => {
            //     this._zone.runOutsideAngular(() => {
            //         abp.signalr.connect();
            //     });
            // });
        }

        this.notify$ = this.settings.notify.subscribe(() => this.setClass());
        this.setClass();

    }

    registerEvents() {
        this.$isFetching.pipe(debounceTime(500), takeUntil(this.$destroy))
            .subscribe(result => {
                this.isFetching = result;
            });
        abp.event.on('abp.ui.setBusy', () => {
            this.$isFetching.next(true);
            // this.isFetching = true;
        });
        abp.event.on('abp.ui.clearBusy', () => {
            this.$isFetching.next(false);
            // this.isFetching = false;
        });

    }

    ngAfterViewInit(): void {
        // Setting componet for only developer
        // if (!environment.production) {
        //     setTimeout(() => {
        //         const settingFactory = this.resolver.resolveComponentFactory(
        //             SettingDrawerComponent,
        //         );
        //         this.settingHost.createComponent(settingFactory);
        //     }, 22);
        // }
    }

    ngOnDestroy() {
        this.notify$.unsubscribe();
    }
}
