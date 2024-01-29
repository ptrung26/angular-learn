import {
    Compiler,
    Component,
    ComponentFactoryResolver,
    ComponentRef, Injector,
    Input, NgModuleFactory,
    OnDestroy,
    OnInit, Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { combineLatest, from, Observable } from '@node_modules/rxjs';
import { debounceTime, finalize, map, switchMap, tap, delay } from 'rxjs/operators';
import * as _ from 'lodash';
import { OraMapModComService } from '../../ora-map-mod-com.service';

export interface TabContentInput {
    key: string;
    dataRef?: any;
    dataObsRef?: Observable<any>;
}

@Component({
    selector: 'layout-tab-content',
    templateUrl: './layout-tab-content.component.html',
    styleUrls: ['./layout-tab-content.component.css'],
})
export class LayoutTabContentComponent implements OnInit, OnDestroy {
    @ViewChild('container', {
        read: ViewContainerRef,
        static: true,
    }) container: ViewContainerRef;

    @Input() set component(v: TabContentInput) {
        const res = this.mapService.findByKey(v.key);
        if (res) {
            this.renderComponent(res.module, res.component, v.dataRef, v.dataObsRef);
        } else {
            abp.message.warn('Đề nghị cấu hình lại map.config nhé Dev với key:' + v.key);
            console.warn('Đề nghị cấu hình lại map.config nhé Dev với key:' + v.key);
        }
    }


    constructor(private factoryResolver: ComponentFactoryResolver,
                private mapService: OraMapModComService,
                private compiler: Compiler, private injector: Injector,
    ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    private renderComponent(ipModule: Promise<Type<any>>, ipComponent: Promise<Type<any>>, dataCom: any, dataObsRef: Observable<any>) {
        // let ipModule = import('@app/pages/thanh-vien/thanh-vien.module').then(x => x.ThanhVienModule);
        if (ipModule) {
            const moduleLazy = from(ipModule).pipe(switchMap((moduleLazy) => {
                const moduleFactory = moduleLazy instanceof NgModuleFactory ? moduleLazy
                    : from(this.compiler.compileModuleAsync(moduleLazy));
                return moduleFactory;
            }));
            combineLatest([
                from(ipComponent),
                moduleLazy,
            ]).pipe(tap(() => abp.ui.setBusy()), finalize(() => abp.ui.clearBusy())).subscribe(([lazyComponent, moduleFactory]) => {
                const moduleRef = moduleFactory.create(this.injector);
                const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(lazyComponent);
                this.container.clear();
                const componentRef = this.container.createComponent(componentFactory);
                if (componentRef.instance) {
                    componentRef.instance.dataRef = dataCom; //dataCom; // 'Message from container';
                    componentRef.instance.dataObsRef = dataObsRef; //dataCom; // 'Message from container';
                }
            });
        } else {
            from(ipComponent).subscribe(component => {
                const container = this.container;
                container.clear();
                const injector = container.injector;
                const cfr: ComponentFactoryResolver = injector.get(ComponentFactoryResolver);
                const componentFactory = cfr?.resolveComponentFactory<any>(component);
                // const componentRef = container.createComponent(componentFactory, container.length, injector);
                const componentRef = container.createComponent(componentFactory, 0, injector);
                if (componentRef.instance) {
                    componentRef.instance.dataRef = dataCom; //dataCom; // 'Message from container';
                    componentRef.instance.dataObsRef = dataObsRef; //dataCom; // 'Message from container';
                }
                // componentRef.changeDetectorRef.detectChanges();
                // this.componentRef = componentRef;
            });
        }


    }


}
