import {
    Component,
    DebugElement,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as _ from 'lodash';
import { validSDT } from '@app/shared/customValidator/validSDT';
import { validNumber } from '@app/shared/customValidator/validNumber';
import {
    debounceTime,
    distinctUntilChanged,
    takeUntil,
    finalize,
    first,
    map,
    switchMap,
} from '@node_modules/rxjs/internal/operators';
import {
    CaBenhServiceProxy,
    DanhMucThuocServiceProxy,
    KET_QUA_XET_NGHIEM,
    DON_VI_CHI_SO,
    KET_QUA_DIEU_TRI,
    NHOM_XET_NGHIEM_NHIEU_LAN,
    NHOM_THUOC,
    NHOM_BENH,
    CaBenhGetForEditDto, CaBenh_DieuTriDto, CaBenh_XetNghiemDto, CaBenhDto, CheckValidSoCMNDRequest,
} from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs/internal/Subject';
import { CreateOrEditDieuTriComponent } from '@app/pages/ca-benh/danh-sach/create-or-edit-dieu-tri.component';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';


@Component({
    selector: 'create-or-update-ca-benh',
    templateUrl: './create-or-edit-ca-benh.component.html',
    styleUrls: ['./create-or-edit-ca-benh.component.less'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class CreateOrEditCaBenhComponent extends AppComponentBase implements OnInit, OnDestroy {
    $destroy: Subject<boolean> = new Subject<boolean>();
    rfDataModal: FormGroup;
    @Input() caBenhId: number;
    @Input() hoTen: string;
    @Input() maBN: string;
    @Input() maCoSo: string;
    @Input() isView: boolean;
    @Input() thuocDieuTriViemGanB: any;
    @Input() thuocDieuTriViemGanC: any;
    @Output() backListEvent = new EventEmitter<boolean>();

    headerTitle = '';
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

    constructor(
        injector: Injector,
        private _dataService: CaBenhServiceProxy,
        private _thuocService: DanhMucThuocServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.headerTitle = 'Thêm mới ca bệnh';

        this.rfDataModal = this.fb.group({
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
        });
        if (this.caBenhId > 0) {
            this._dataService.getForEdit(this.caBenhId)
                .pipe(finalize(() => {
                }))
                .subscribe(result => {
                    this.updateSoCMND = result.caBenh.soCMND;
                    this.headerTitle = 'Sửa thông tin ca bệnh: ' + this.hoTen + ' (' + this.maCoSo + '-' + this.maBN.padStart(5, '0') + ')';
                    this.rfDataModal.patchValue(result.caBenh);
                    //Set các giá trị mặc định
                    if (this.rfDataModal.get('danTocId').value > 0) {
                        this.rfDataModal.get('danTocId').setValue(result.caBenh.danTocId.toString());
                    }
                    if (this.rfDataModal.get('ngheNghiepId').value > 0) {
                        this.rfDataModal.get('ngheNghiepId').setValue(result.caBenh.ngheNghiepId.toString());
                    }
                    if (this.rfDataModal.get('gioiTinh').value === 0) {
                        this.rfDataModal.get('gioiTinh').setValue(1);
                    }
                    if (this.rfDataModal.get('plT_DonVi').value === 0) {
                        this.rfDataModal.get('plT_DonVi').setValue(1);
                    }
                    this.listDieuTri = result.listDieuTri;
                    this.ngaySinh = Date.parse('01/01/' + result.caBenh.namSinh + '');
                });
        }
        this.rfDataModal.get('hBsAg_KetQua').valueChanges.pipe(takeUntil(this.$destroy)).subscribe((result: any) => {
            if (result === this.ketQuaXetNghiem.DUONG_TINH || result === this.ketQuaXetNghiem.AM_TINH) {
                this.rfDataModal.controls['hBsAg_NgayLam'].setValidators([Validators.required]);
                this.rfDataModal.controls['hBsAg_NgayLam'].updateValueAndValidity();
            } else {
                this.rfDataModal.controls['hBsAg_NgayLam'].clearValidators();
                this.rfDataModal.controls['hBsAg_NgayLam'].updateValueAndValidity();
                this.rfDataModal.get('hBsAg_NgayLam').setValue(null);
            }
        });
        this.rfDataModal.get('antiHCV_KetQua').valueChanges.pipe(takeUntil(this.$destroy)).subscribe((result: any) => {
            if (result === this.ketQuaXetNghiem.DUONG_TINH || result === this.ketQuaXetNghiem.AM_TINH) {
                this.rfDataModal.controls['antiHCV_NgayLam'].setValidators([Validators.required]);
                this.rfDataModal.controls['antiHCV_NgayLam'].updateValueAndValidity();
            } else {
                this.rfDataModal.controls['antiHCV_NgayLam'].clearValidators();
                this.rfDataModal.controls['antiHCV_NgayLam'].updateValueAndValidity();
                this.rfDataModal.get('antiHCV_NgayLam').setValue(null);
            }
        });
        this.rfDataModal.get('tuVong').valueChanges.pipe(takeUntil(this.$destroy)).subscribe((result: any) => {
            if (result === true) {
                this.rfDataModal.controls['ngayTuVong'].setValidators([Validators.required]);
                this.rfDataModal.controls['ngayTuVong'].updateValueAndValidity();
            } else {
                this.rfDataModal.controls['ngayTuVong'].clearValidators();
                this.rfDataModal.get('ngayTuVong').setValue(null);
                this.rfDataModal.controls['ngayTuVong'].updateValueAndValidity();
            }
        });
    }

    ngOnDestroy(): void {
    }

    close(isSave: boolean) {
        this.backListEvent.emit(isSave);
    }

    changeNamSinh(value) {
        this.rfDataModal.patchValue({
                tuoi: this.maxYear - this.rfDataModal.value.namSinh,
            },
        );
        this.ngaySinh = Date.parse('01/01/' + this.rfDataModal.value.namSinh + '');
    }

    disabledDate = (current: Date): boolean => {
        if (differenceInCalendarDays(current, this.today) > 0) {
            return true;
        } else if (differenceInCalendarDays(current, this.ngaySinh) < 0) {
            return true;
        }
        return false;
    };

    addDieuTri(nhomBenh): void {
        let dataItem = new CaBenh_DieuTriDto();
        dataItem.id = 0;
        dataItem.nhomBenh = nhomBenh;
        dataItem.jsonThuocSuDung = '';
        dataItem.listXetNghiem = [];
        this.modalHelper.create(CreateOrEditDieuTriComponent, {
                dataItem: dataItem,
                thuocDieuTriViemGanB: this.thuocDieuTriViemGanB,
                thuocDieuTriViemGanC: this.thuocDieuTriViemGanC,
                ngaySinh: this.ngaySinh,
            },
            {
                size: 1000, includeTabs: false,
                modalOptions: {
                    nzTitle: 'Thêm mới đợt điều trị',
                },
            })
            .subscribe(result => {
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

    editDieuTri(index: number): void {
        let dataItem = this.listDieuTri[index];
        this.modalHelper.create(CreateOrEditDieuTriComponent, {
                dataItem: dataItem,
                isView: this.isView,
                thuocDieuTriViemGanB: this.thuocDieuTriViemGanB,
                thuocDieuTriViemGanC: this.thuocDieuTriViemGanC,
                ngaySinh: this.ngaySinh,
            },
            {
                size: 1000, includeTabs: false,
                modalOptions: {
                    nzTitle: this.isView === true ? 'Xem thông tin đợt điều trị' : 'Sửa thông tin đợt điều trị',
                },
            })
            .subscribe(result => {
                if (result) {
                    if (result.ketQuaDieuTri === this.ketQuaDieuTri.AC_TINH) {
                        result.strKetQuaDieuTri = 'Ác tính';
                    } else if (result.ketQuaDieuTri === this.ketQuaDieuTri.LANH_TINH) {
                        result.strKetQuaDieuTri = 'Lành tính';
                    } else if (result.ketQuaDieuTri === this.ketQuaDieuTri.NGHI_NGO) {
                        result.strKetQuaDieuTri = 'Nghi ngờ';
                    }
                    this.listDieuTri[index] = result;
                }
            });
    }

    deleteDieuTri(index) {
        let dieuTri = this.listDieuTri[index];
        dieuTri.isDeleted = true;
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
                    checkInput.donViCoSoId = this.rfDataModal.value.donViCoSoId;
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

    save(): void {
        if (this.rfDataModal.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
                this.rfDataModal.controls[i].markAsDirty();
                this.rfDataModal.controls[i].updateValueAndValidity();
            }
        } else {
            this.saving = true;
            let caBenhDto = new CaBenhDto();
            caBenhDto = this.rfDataModal.value;
            //Lưu thông tin đợt điều trị cuối
            let dieuTriViemGanB = _.cloneDeep(this.listDieuTri.filter(x => x.nhomBenh === this.nhomBenh.VIEM_GAN_B));
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
            } else { //dành cho trường hợp có bản ghi điều trị rồi lại xóa hết
                caBenhDto.soLanDieuTri_ViemGanB = 0;
                caBenhDto.ngayBatDau_ViemGanB = null;
                caBenhDto.ngayKetThuc_ViemGanB = null;
                caBenhDto.ketQuaDieuTri_ViemGanB = 0;
                caBenhDto.hbvdnA_LanCuoi_NgayLam = null;
                caBenhDto.hbvdnA_LanCuoi_Nguong = null;
            }
            let dieuTriViemGanC = _.cloneDeep(this.listDieuTri.filter(x => x.nhomBenh === this.nhomBenh.VIEM_GAN_C));
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
            } else {//dành cho trường hợp có bản ghi điều trị rồi lại xóa hết
                caBenhDto.soLanDieuTri_ViemGanC = 0;
                caBenhDto.ngayBatDau_ViemGanC = null;
                caBenhDto.ngayKetThuc_ViemGanC = null;
                caBenhDto.ketQuaDieuTri_ViemGanC = 0;
                caBenhDto.hcvarN_LanCuoi_NgayLam = null;
                caBenhDto.hcvarN_LanCuoi_Nguong = null;
            }
            caBenhDto.listDieuTri = this.listDieuTri;
            this._dataService.createOrUpdate(caBenhDto)
                .pipe(finalize(() => {
                    this.saving = false;
                }))
                .subscribe(result => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.close(false);
                });
        }
    }

}
