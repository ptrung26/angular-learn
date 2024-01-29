import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import * as XLSX from '@node_modules/xlsx';
import { FormControl } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'dropdown-up-excel',
    templateUrl: './drop-down-upload-excel.component.html',
    styleUrls: ['./drop-down-upload-excel.component.css'],
})
export class DropDownUploadExcelComponent extends AppComponentBase implements OnInit {
    @Output() onUpload = new EventEmitter<any>();
    @Input() urlMauFile = '';
    @Input() importText = 'Thêm mới từ file Excel';
    @Input() itemMenu1: TemplateRef<any>;
    @Input() itemMenu2: TemplateRef<any>;
    @Input() itemMenu3: TemplateRef<any>;

    // daUploadKetQua = false;
    fileControl = new FormControl();
    isUploading = false;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {}

    onFileChange($event: any) {
        // const funreturn = this.onUpload;
        this.isUploading = true;
        const formData = new FormData();
        const file = $event.target.files[0];
        formData.append('file', file);
        this.fileControl.patchValue('');

        const that = this;
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            const arrayBuffer: any = fileReader.result;
            let data = new Uint8Array(arrayBuffer);
            let arr = new Array();
            for (let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            let bstr = arr.join('');
            let workbook = XLSX.read(bstr, { type: 'binary' });

            const sheet_name = workbook.SheetNames[0];
            const dataJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], { header: 2, raw: true });
            // funreturn.emit(dataJSON);
            this.onUpload.emit(dataJSON);
            this.isUploading = false;
        };
        fileReader.readAsArrayBuffer(file);
    }
}
