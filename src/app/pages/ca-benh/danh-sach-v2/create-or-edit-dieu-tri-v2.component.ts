import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import {
    CaBenhServiceProxy,
    CaBenh_DieuTriDto,
    KET_QUA_DIEU_TRI,
    KET_QUA_XET_NGHIEM,
    NHOM_BENH,
    NHOM_THUOC,
    NHOM_XET_NGHIEM_NHIEU_LAN,
} from '@shared/service-proxies/service-proxies';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as _ from 'lodash';
@Component({
    selector: 'create-or-update-dieu-tri-v2',
    templateUrl: './create-or-update-dieu-tri-v2.component.html',
})
export class CreateOrEditDieuTriV2Component extends ModalComponentBase implements OnInit {
    @Input() dataItem: CaBenh_DieuTriDto;
    @Input() isView: boolean;
    @Input() thuocDieuTriViemGanB: any;
    @Input() thuocDieuTriViemGanC: any;
    @Input() ngaySinh: Date;
    rfDataModal: FormGroup;
    saving = false;
    ketQuaXetNghiem = KET_QUA_XET_NGHIEM;
    ketQuaDieuTri = KET_QUA_DIEU_TRI;
    nhomXetNghiemNhieuLan = NHOM_XET_NGHIEM_NHIEU_LAN;
    nhomThuoc = NHOM_THUOC;
    nhomBenh = NHOM_BENH;
    maxYear: number = new Date().getFullYear();
    today = new Date();

    constructor(injector: Injector, private _dataService: CaBenhServiceProxy, private fb: FormBuilder) {
        super(injector);
    }

    ngOnInit(): void {
        console.log(this.dataItem);
        this.rfDataModal = this.fb.group({
            id: 0,
            nhomBenh: 0,
            ngayBatDau: ['', [Validators.required]],
            ngayKetThuc: [''],
            thuocSuDung: [''],
            jsonThuocSuDung: [''],
            ketQuaDieuTri: [1, [Validators.required]],
            ghiChu: [''],
            isDeleted: false,
            listThuocDieuTri: [this.getListThuocDieuTri(this.dataItem.nhomBenh, this.dataItem.jsonThuocSuDung)],
            listXetNghiem: this.fb.array([]),
        });
        this.rfDataModal.patchValue(this.dataItem);
        this.initFormArrayXetNghiem(this.dataItem.listXetNghiem);
    }

    get xetNghiems(): FormArray {
        return this.rfDataModal.get('listXetNghiem') as FormArray;
    }

    disabledDate = (current: Date): boolean => {
        if (differenceInCalendarDays(current, this.today) > 0) {
            return true;
        } else if (differenceInCalendarDays(current, this.ngaySinh) < 0) {
            return true;
        }
        return false;
    };

    addXetNghiem(tenXetNghiem, loaiXetNghiem) {
        this.xetNghiems.push(
            this.fb.group({
                id: 0,
                tenXetNghiem: tenXetNghiem,
                nhomXetNghiem: loaiXetNghiem,
                ngayLam: ['', [Validators.required]],
                donVi: [1, [Validators.required]],
                chiSo: [0, [Validators.required]],
                nguong: [1, [Validators.required]],
                isDeleted: false,
            }),
        );
    }

    deleteXetNghiem(index) {
        let xetNghiem = this.xetNghiems.controls[index];
        xetNghiem.get('ngayLam').clearValidators();
        xetNghiem.get('ngayLam').updateValueAndValidity();
        xetNghiem.get('chiSo').clearValidators();
        xetNghiem.get('chiSo').updateValueAndValidity();
        xetNghiem.get('nguong').clearValidators();
        xetNghiem.get('nguong').updateValueAndValidity();
        xetNghiem.get('isDeleted').setValue(true);
    }

    initFormArrayXetNghiem(data: any[]) {
        const controls = this.xetNghiems;
        data.forEach((item) => {
            controls.push(
                this.fb.group({
                    id: item.id,
                    tenXetNghiem: item.tenXetNghiem,
                    nhomXetNghiem: item.nhomXetNghiem,
                    ngayLam: item.ngayLam,
                    donVi: item.donVi,
                    chiSo: item.chiSo,
                    nguong: item.nguong,
                    isDeleted: item.isDeleted,
                }),
            );
        });
    }

    getListThuocDieuTri(loaiBenh: number, thuocSuDung: string | undefined) {
        let arrThuoc = [];
        if (!thuocSuDung) {
            if (loaiBenh === this.nhomBenh.VIEM_GAN_B) {
                arrThuoc = _.cloneDeep(this.thuocDieuTriViemGanB);
                console.log(arrThuoc);
            } else {
                arrThuoc = _.cloneDeep(this.thuocDieuTriViemGanC);
                console.log(arrThuoc);
            }
        } else {
            arrThuoc = JSON.parse(thuocSuDung);
        }

        return arrThuoc;
    }

    save(): void {
        if (this.rfDataModal.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
                this.rfDataModal.controls[i].markAsDirty();
                this.rfDataModal.controls[i].updateValueAndValidity();
            }
            for (const i in this.xetNghiems.controls) {
                const fGr: any = this.xetNghiems.controls[i];
                // tslint:disable-next-line:forin
                for (const j in fGr.controls) {
                    fGr.controls[j].markAsDirty();
                    fGr.controls[j].updateValueAndValidity();
                }
            }
        } else {
            this.saving = true;
            //Lấy tên đợt kết quả điều trị

            if (this.rfDataModal.get('listThuocDieuTri').value.length > 0) {
                this.rfDataModal.get('jsonThuocSuDung').setValue(JSON.stringify(this.rfDataModal.get('listThuocDieuTri').value));
            }
            this.success(this.rfDataModal.value);
        }
    }
}
