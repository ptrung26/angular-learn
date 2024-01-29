import { Injectable, Type } from '@angular/core';

export interface OraMapModComOutput {
    key: string;
    module?: Promise<Type<any>>;
    component: Promise<Type<any>>;
}

@Injectable()
export class OraMapModComService {

    private listMap: OraMapModComOutput[] = [];

    initMap(val: OraMapModComOutput[]) {
        this.listMap = val ? val : [];
    }

    findByKey(key: string): OraMapModComOutput {
        return this.listMap.find(x => x.key === key);
        // switch (key) {
        //     case '/app/admin/users':
        //         return {
        //             module: import('@app/pages/admin/admin.module').then(x => x.AdminModule),
        //             component: import('@app/pages/admin/users/users.component').then(x => x.UsersComponent),
        //         };
        //     case '/app/admin/languages':
        //         return {
        //             module: import('@app/pages/admin/admin.module').then(x => x.AdminModule),
        //             component: import('@app/pages/admin/languages/languages.component').then(x => x.LanguagesComponent),
        //         };
        // }
    }

    constructor() {
    }
}
