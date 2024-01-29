import { Injector } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AppComponentBase } from '@shared/common/app-component-base';

export abstract class ModalComponentBase extends AppComponentBase {
    title = '';
    nzLabel = 8;
    nzForm = 16;
    nzModalRef: NzModalRef;

    constructor(injector: Injector) {
        super(injector);
        this.nzModalRef = injector.get(NzModalRef);
    }

    success(result: any = true) {
        if (result) {
            this.nzModalRef.close(result);
        } else {
            this.close();
        }
    }

    close($event?: MouseEvent): void {
        this.nzModalRef.close();
    }
}
