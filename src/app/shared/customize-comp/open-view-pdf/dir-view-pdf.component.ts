import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConsts} from '@shared/AppConsts';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'dir-view-pdf',
    template: `
        <div [ngStyle]="{height:height, width:width}">
            <div *ngIf="noData; then thenBlock0 else elseBlock0"></div>
            <ng-template #thenBlock0>
                <div class="d-flex justify-content-center" style="height: 100%;width:100%;">
                    <span class="fa fa-info-circle">Không có dữ liệu</span>
                </div>
            </ng-template>
            <ng-template #elseBlock0>
                <div *ngIf="!loading; then thenBlock1 else elseBlock1"></div>
                <ng-template #thenBlock1>
                    <div style="height: 100%;width:100% ">
                        <iframe width="100%" height="100%" *ngIf="data" [src]="data | safe: 'resourceUrl'"
                                type="application/pdf"></iframe>
                    </div>
                </ng-template>
                <ng-template #elseBlock1>
                    <div class="d-flex justify-content-center" style="height: 100%;width:100%;">
                        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
                    </div>
                </ng-template>
            </ng-template>
        </div>`
})
export class DirViewPdfComponent implements OnChanges {
    @Input() dataInput = '';
    @Input() type: 'base64' | 'url' | 'urlAbs' = 'url';
    @Input() width = '100%';
    @Input() height = 'inherit';
    http: HttpClient;
    loading = true;
    noData = true;
    data: any;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        this.http = http;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataInput) {
            if (changes.dataInput.currentValue) {
                this.noData = false;
                switch (this.type) {
                    case 'url':
                        this.loadDataFromServer(changes.dataInput.currentValue);
                        break;
                    case 'urlAbs':
                        this.loading = false;
                        this.data = URL.createObjectURL(changes.dataInput.currentValue) + '#zoom=85';
                        break;
                    default:
                        this.loading = false;
                        this.data = 'data:application/pdf;base64,' + changes.dataInput.currentValue;
                }
            } else {
                this.noData = true;
                this.loading = false;
            }

        }
    }

    loadDataFromServer = function (url: string) {
        this.loading = true;
        let urlFile = AppConsts.remoteServiceBaseUrl + '/File/GoToViewTaiLieu';
        let input = new FormData();
        input.append('url', url);
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        this.http
            .post(urlFile, input, {headers, responseType: 'blob'})
            .pipe(finalize(() => {
                this.loading = false;
            }))
            .subscribe(res => {
                this.data = URL.createObjectURL(res) + '#zoom=85';
            });
    };
}
