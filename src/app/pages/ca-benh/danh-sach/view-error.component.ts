import {Component, Injector, Input, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {CaBenhImportDto} from '@shared/service-proxies/service-proxies';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';


@Component({
    templateUrl: './view-error.component.html',
})
export class ViewErrorImportCaBenhComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: CaBenhImportDto;
    rfDataModal: FormGroup;
    saving = false;

    constructor(
        injector: Injector,
        //private _dataService: DanhMucNgheNghiepServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit(): void {

    }
}
