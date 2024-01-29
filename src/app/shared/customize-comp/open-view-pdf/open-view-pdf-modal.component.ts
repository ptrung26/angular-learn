import {Component, Inject, HostListener, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

interface IData {
    pdfSrc?: string;
    type?: string;
}

@Component({
    template: `
        <dir-view-pdf style="padding: -8px" *ngIf="pdfSrc" [ngStyle]="{'height.px': scrHeight}" [dataInput]="pdfSrc"
                      [type]="type"
        ></dir-view-pdf>
        <div *nzModalFooter>
            <button type="button" nz-button nzType="default" (click)="close()">Đóng</button>
        </div>
    `
})
export class OpenViewPdfModalComponent implements OnInit {
    @Input() pdfSrc: string;
    @Input() type: 'base64' | 'url' | 'urlAbs' = 'url';
    scrHeight: any;
    scrWidth: any;

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.scrHeight = window.innerHeight * 3 / 4 - 140;
        this.scrWidth = window.innerWidth * 3 / 4;
    }

    constructor(
        private modal: NzModalRef,
    ) {
        this.getScreenSize();
    }

    ngOnInit(): void {
    }

    close(): void {
        this.modal.destroy();
    }

}
