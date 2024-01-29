import {ComponentFactory, ComponentRef, TemplateRef, Type} from '@angular/core';
import {Observable} from '@node_modules/rxjs';


export class TabDataType {
    id?: string;
    title?: string | TemplateRef<any>;
    permissionName?: string;
    key?: string; // router-link
    iconClass?: string; // iconClass
    iconLink?: string;
    // moduleRef?: Promise<Type<any>>;
    viewRef?: TemplateRef<any> | string | undefined;
    dataRef?: any;
    dataObsRef?: Observable<any>;

    viewType?: 'component' | 'template' | 'html';
    showMultiTab?: boolean;
    childrens?: TabDataType[];
    requiresAuthentication?: boolean;

    // moduleName?: 'thanhVienModule' | 'adminModule';

    constructor(input: TabDataType) {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        this.id = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        this.title = input.title;
        this.iconClass = input.iconClass;
        this.iconLink = input.iconLink;
        this.key = input.key;
        // this.moduleRef = input.moduleRef;
        this.viewRef = input.viewRef;
        this.dataRef = input.dataRef;
        this.dataObsRef = input.dataObsRef;
        this.viewType = input.viewType ? input.viewType : 'component';
        this.showMultiTab = (input.showMultiTab === null || input.showMultiTab === undefined) ? false : input.showMultiTab;

        // if (input.childrens === undefined) {
        //     this.childrens = [];
        // } else {
        //     this.childrens = input.childrens;
        // }
        if (this.permissionName) {
            this.requiresAuthentication = true;
        } else {
            this.requiresAuthentication = input.requiresAuthentication ? input.requiresAuthentication : false;
        }
    }

}
