import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import * as XLSX from '@node_modules/xlsx';
import { FormControl } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { USER_LEVEL } from '@shared/service-proxies/service-proxies';

type AOA = any[][];

@Component({
    selector: 'dropdown-up-excel-array',
    templateUrl: './drop-down-upload-excel-array.component.html',
    styleUrls: ['./drop-down-upload-excel-array.component.css'],
})
export class DropDownUploadExcelArrayComponent extends AppComponentBase implements OnInit {
    @Output() onUpload = new EventEmitter<any>();
    @Input() urlMauFile = '';
    @Input() importText = 'Thêm mới từ file Excel';
    @Input() itemMenu1: TemplateRef<any>;
    @Input() itemMenu2: TemplateRef<any>;
    @Input() itemMenu3: TemplateRef<any>;
    data: AOA = [
        [1, 2],
        [3, 4],
    ];
    // daUploadKetQua = false;
    fileControl = new FormControl();
    isUploading = false;
    userLevel = USER_LEVEL;

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
        fileReader.onload = (e: any) => {
            const arrayBuffer: any = fileReader.result;
            let data = new Uint8Array(arrayBuffer);
            let arr = new Array();
            for (let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            let bstr = arr.join('');
            let workbook = XLSX.read(bstr, { type: 'binary' });
            //let workbook = XLSX.read(bstr, {type: 'binary', cellText:false,cellDates:true});

            const sheet_name = workbook.SheetNames[0];
            //const dataJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], {header: 2, raw: true, defval:'', dateNF:'MM/dd/yyyy'});
            const dataJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], {
                header: 2,
                raw: true,
                defval: '',
            });
            this.onUpload.emit(dataJSON);
            console.log(dataJSON);
            this.isUploading = false;
        };
        fileReader.readAsArrayBuffer(file);
    }
}
