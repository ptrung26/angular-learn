import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { validNumber } from '@app/shared/customValidator/validNumber';
import { validSDT } from '@app/shared/customValidator/validSDT';
import { AppComponentBase } from '@shared/common/app-component-base';
import { differenceInCalendarDays, setHours } from 'date-fns';
import {
    CaBenhDto,
    CaBenhServiceProxy,
    CaBenh_DieuTriDto,
    CheckValidSoCMNDRequest,
    DON_VI_CHI_SO,
    KET_QUA_DIEU_TRI,
    KET_QUA_XET_NGHIEM,
    NHOM_BENH,
} from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, first, map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { CreateOrEditDieuTriV2Component } from './create-or-edit-dieu-tri-v2.component';

@Component({
    selector: 'app-create-or-update-v2',
    templateUrl: './create-or-update-ca-benh-v2.component.html',
    styleUrls: ['./create-or-edit-ca-benh-v2.component.less'],
})
export class CreateOrUpdateCaBenhV2Component extends AppComponentBase implements OnInit {
    @Input() caBenhId: number;
    @Input() hoTen: string;
    @Input() maBN: string;
    @Input() isView: boolean;
    @Input() thuocDieuTriViemGanB: any;
    @Input() thuocDieuTriViemGanC: any;
    @Output() backListEvent = new EventEmitter<boolean>();
    headerTitle?: string;
    rsFormGroup?: FormGroup;
    saving = false;
    maxYear: number = new Date().getFullYear();
    minYear: number = this.maxYear - 100;
    ketQuaXetNghiem = KET_QUA_XET_NGHIEM;
    ketQuaDieuTri = KET_QUA_DIEU_TRI;
    donViChiSo = DON_VI_CHI_SO;
    nhomBenh = NHOM_BENH;
    listDieuTri: CaBenh_DieuTriDto[] = [];
    today = new Date();
    updateSoCMND = '';
    ngaySinh = Date.parse('01/01/' + this.maxYear + '');
    data?: any;

    constructor(private injector: Injector, private _dataService: CaBenhServiceProxy, private fb: FormBuilder) {
        super(injector);
    }

    ngOnInit(): void {
        this.headerTitle = '';

        this.rsFormGroup = this.fb.group({
            id: '0',
            maBN: [''],
            hoTen: ['', [Validators.required]],
            namSinh: ['', [Validators.required]],
            tuoi: [0],
            dienThoai: ['', [validSDT]],
            diaChi: [''],
            maTinh: [''],
            maHuyen: [''],
            maXa: [''],
            gioiTinh: [1, [Validators.required]],
            danTocId: [''],
            ngheNghiepId: [''],
            soCMND: ['', [validNumber], this.SoCMNDExistValidator.bind(this)],
            ngayCapCMND: [''],
            noiCapCMND: [''],
            soBHYT: [''],
            nhiemHIV: [false],
            viemGanD: [false],
            tuVong: [false],
            ngayTuVong: [],
            hBsAg_KetQua: [-1],
            hBsAg_NgayLam: [],
            antiHCV_KetQua: [-1],
            antiHCV_NgayLam: [],
            plT_ChiSo: [0],
            plT_DonVi: [1],
            asT_ChiSo: [0],
            alT_ChiSo: [0],
            hBeAb_KetQua: [-1],
            hBeAg_KetQua: [-1],
            antiHBe_KetQua: [-1],
            antiHBs_KetQua: [-1],
            antiHBcIgM_KetQua: [-1],
            antiHBcIgG_KetQua: [-1],
            chanDoanViemGanB: [''],
            viemGanBMan: [false],
            hcVcAg_KetQua: [-1],
            chanDoanViemGanC: [''],
            viemGanCMan: [false],
            hbvdnA_NgayLam: [],
            hbvdnA_ChiSo: [0],
            hbvdnA_Nguong: [1],
            hbvdnA_DonVi: [1],
            hcvarN_NgayLam: [],
            hcvarN_ChiSo: [0],
            hcvarN_Nguong: [1],
            hcvarN_DonVi: [1],
            hcvGenotype_NgayLam: [],
            hcvGenotype_ChiSo: [0],
            hcvGenotype_Nguong: [1],
            hcvGenotype_KieuGen: [1],
            donViCoSoId: [-1],
        });
        if (this.caBenhId) {
            this._dataService.getForEdit(this.caBenhId).subscribe((result) => {
                if (result) {
                    this.headerTitle = `Sửa thông tin ca bệnh: ${this.hoTen} (${this.maBN})`;
                    this.data = result.caBenh;
                    this.rsFormGroup.patchValue(result.caBenh);
                } else {
                    this.headerTitle = 'Thêm mới ca bệnh';
                }
            });
        }
    }

    SoCMNDExistValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        return control.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            first(),
            switchMap((soCMND) => {
                let checkInput = new CheckValidSoCMNDRequest();
                checkInput.soCMND = soCMND;
                checkInput.updateSoCMND = this.updateSoCMND;
                if (this.caBenhId > 0) {
                    checkInput.donViCoSoId = this.rsFormGroup.value.donViCoSoId;
                } else {
                    checkInput.donViCoSoId = this.appSession.user.donViCoSoId;
                }
                return this._dataService.isSoCMNDExist(checkInput).pipe(
                    map<boolean, ValidationErrors>((res) => {
                        if (res) {
                            return { SoCMNDExist: true };
                        } else {
                            return null;
                        }
                    }),
                );
            }),
        );
    }

    changeNamSinh(value) {
        this.rsFormGroup.patchValue({
            tuoi: this.maxYear - this.rsFormGroup.value.namSinh,
        });
        this.ngaySinh = Date.parse('01/01/' + this.rsFormGroup.value.namSinh + '');
    }

    disabledDate = (current: Date): boolean => {
        if (differenceInCalendarDays(current, this.today) > 0) {
            return true;
        } else if (differenceInCalendarDays(current, this.ngaySinh) < 0) {
            return true;
        }
        return false;
    };
    save(): void {
        if (this.rsFormGroup.invalid) {
            console.log(this.rsFormGroup.errors);
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rsFormGroup.controls) {
                this.rsFormGroup.controls[i].markAsDirty();
                this.rsFormGroup.controls[i].updateValueAndValidity();
            }
        } else {
            this.saving = true;
            let caBenhDto = new CaBenhDto();
            caBenhDto = this.rsFormGroup.value;
            // for (const propertyName in caBenhDto) {
            //     if (this.data.hasOwnProperty(propertyName)) {
            //         const propertyValue = this.data[propertyName];
            //         caBenhDto[propertyName] = propertyValue;
            //     }
            //     if (this.rsFormGroup.value.hasOwnProperty(propertyName)) {
            //         const propertyValue = this.rsFormGroup.value[propertyName];
            //         caBenhDto[propertyName] = propertyValue;
            //     }
            // }

            console.log(caBenhDto);

            //Lưu thông tin đợt điều trị cuối
            let dieuTriViemGanB = _.cloneDeep(this.listDieuTri.filter((x) => x.nhomBenh === this.nhomBenh.VIEM_GAN_B));
            if (dieuTriViemGanB.length > 0) {
                let dieuTriViemGanBSort = _.sortBy(dieuTriViemGanB, 'ngayBatDau');
                caBenhDto.soLanDieuTri_ViemGanB = dieuTriViemGanBSort.length;
                let dieuTri = dieuTriViemGanBSort[dieuTriViemGanBSort.length - 1];
                caBenhDto.ketQuaDieuTri_ViemGanB = dieuTri.ketQuaDieuTri;
                caBenhDto.ngayBatDau_ViemGanB = dieuTri.ngayBatDau;
                caBenhDto.ngayKetThuc_ViemGanB = dieuTri.ngayKetThuc;
                if (dieuTri.listXetNghiem.length > 0) {
                    caBenhDto.hbvdnA_LanCuoi_Nguong = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].nguong;
                    caBenhDto.hbvdnA_LanCuoi_NgayLam = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].ngayLam;
                }
            } else {
                //dành cho trường hợp có bản ghi điều trị rồi lại xóa hết
                caBenhDto.soLanDieuTri_ViemGanB = 0;
                caBenhDto.ngayBatDau_ViemGanB = null;
                caBenhDto.ngayKetThuc_ViemGanB = null;
                caBenhDto.ketQuaDieuTri_ViemGanB = 0;
                caBenhDto.hbvdnA_LanCuoi_NgayLam = null;
                caBenhDto.hbvdnA_LanCuoi_Nguong = null;
            }
            let dieuTriViemGanC = _.cloneDeep(this.listDieuTri.filter((x) => x.nhomBenh === this.nhomBenh.VIEM_GAN_C));
            if (dieuTriViemGanC.length > 0) {
                let dieuTriViemGanCSort = _.sortBy(dieuTriViemGanC, 'ngayBatDau');
                caBenhDto.soLanDieuTri_ViemGanC = dieuTriViemGanCSort.length;
                let dieuTri = dieuTriViemGanCSort[dieuTriViemGanCSort.length - 1];
                caBenhDto.ketQuaDieuTri_ViemGanC = dieuTri.ketQuaDieuTri;
                caBenhDto.ngayBatDau_ViemGanC = dieuTri.ngayBatDau;
                caBenhDto.ngayKetThuc_ViemGanC = dieuTri.ngayKetThuc;
                if (dieuTri.listXetNghiem.length > 0) {
                    caBenhDto.hcvarN_LanCuoi_Nguong = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].nguong;
                    caBenhDto.hcvarN_LanCuoi_NgayLam = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].ngayLam;
                }
            } else {
                //dành cho trường hợp có bản ghi điều trị rồi lại xóa hết
                caBenhDto.soLanDieuTri_ViemGanC = 0;
                caBenhDto.ngayBatDau_ViemGanC = null;
                caBenhDto.ngayKetThuc_ViemGanC = null;
                caBenhDto.ketQuaDieuTri_ViemGanC = 0;
                caBenhDto.hcvarN_LanCuoi_NgayLam = null;
                caBenhDto.hcvarN_LanCuoi_Nguong = null;
            }
            caBenhDto.listDieuTri = this.listDieuTri;
            this._dataService
                .createOrUpdate(caBenhDto)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    }),
                )
                .subscribe((result) => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close(false);
                });
        }
    }

    close(isSave: boolean) {
        this.backListEvent.emit(isSave);
    }

    addDieuTri(nhomBenh): void {
        let dataItem = new CaBenh_DieuTriDto();
        dataItem.id = 0;
        dataItem.nhomBenh = nhomBenh;
        dataItem.jsonThuocSuDung = '';
        dataItem.listXetNghiem = [];
        this.modalHelper
            .create(
                CreateOrEditDieuTriV2Component,
                {
                    dataItem: dataItem,
                    thuocDieuTriViemGanB: this.thuocDieuTriViemGanB,
                    thuocDieuTriViemGanC: this.thuocDieuTriViemGanC,
                    ngaySinh: this.ngaySinh,
                },
                {
                    size: 1000,
                    includeTabs: false,
                    modalOptions: {
                        nzTitle: 'Thêm mới đợt điều trị',
                    },
                },
            )
            .subscribe((result) => {
                if (result) {
                    //Lấy tên kết quả điều trị
                    if (result.ketQuaDieuTri === this.ketQuaDieuTri.AC_TINH) {
                        result.strKetQuaDieuTri = 'Ác tính';
                    } else if (result.ketQuaDieuTri === this.ketQuaDieuTri.LANH_TINH) {
                        result.strKetQuaDieuTri = 'Lành tính';
                    } else if (result.ketQuaDieuTri === this.ketQuaDieuTri.NGHI_NGO) {
                        result.strKetQuaDieuTri = 'Nghi ngờ';
                    }
                    this.listDieuTri.push(result);
                }
            });
    }
}
