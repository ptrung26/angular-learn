import {Injectable} from '@angular/core';
import {
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import {Observable, of} from '@node_modules/rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataCommonService {
    constructor(
        ) {
    }

    async getComboboxData(key: string, func: any, saveIfNull: boolean = false) {

        const session: any = sessionStorage.getItem(key);
        if (session != null && session.length > 2) {
            return JSON.parse(session);
        }
        const result = await func.toPromise();
        if (saveIfNull || result.length > 0) {
            sessionStorage.setItem(key, JSON.stringify(result));
        }
        return result;
    }

    getComboboxDataObs<T = any>(key: string, func: Observable<any[]>, saveIfNull: boolean = false): Observable<T[]> {
        const session: any = sessionStorage.getItem(key);
        if (session) {
            return of(JSON.parse(session));
        }
        const result = func.pipe(tap(item => {
            if (saveIfNull || item.length >0) {
                sessionStorage.setItem(key, JSON.stringify(item));
            }
        }));
        return result;
    }
}
