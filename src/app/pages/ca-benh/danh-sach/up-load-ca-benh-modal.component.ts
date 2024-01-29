import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import {
    CaBenhServiceProxy,
    CheckValidImportExcelCaBenhRequest,
    CaBenhImportDto,
    CaBenh_XetNghiemDto,
    CaBenh_DieuTriDto,
    UploadExcelCaBenhRequest,
    KET_QUA_XET_NGHIEM,
    DON_VI_CHI_SO,
    KET_QUA_DIEU_TRI,
    NHOM_XET_NGHIEM_NHIEU_LAN,
    NHOM_THUOC,
    NHOM_BENH,
    NHOM_NGUONG,
    KIEU_GEN,
} from '@shared/service-proxies/service-proxies';
import { max } from 'rxjs/operators';
import { validSDT } from '@app/shared/customValidator/validSDT';
import { validNumber } from '@app/shared/customValidator/validNumber';
import { DateTime } from 'luxon';
import * as _ from 'lodash';
import { kStringMaxLength } from 'buffer';
import { ViewErrorImportCaBenhComponent } from './view-error.component';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';

@Component({
    selector: 'app-up-load-ca-benh-modal',
    templateUrl: './up-load-ca-benh-modal.component.html',
    styleUrls: ['./up-load-ca-benh-modal.component.css'],
})
export class UploadCaBenhModalComponent extends ModalComponentBase implements OnInit {
    @Input() dataInput: any;
    @Input() thuocDieuTriViemGanB: any;
    @Input() thuocDieuTriViemGanC: any;
    rfDataModal: FormGroup;
    dataImport: CaBenhImportDto[];
    dataHopLe: [];
    ketQuaXetNghiem = KET_QUA_XET_NGHIEM;
    donViChiSo = DON_VI_CHI_SO;
    ketQuaDieuTri = KET_QUA_DIEU_TRI;
    nhomXetNghiemNhieuLan = NHOM_XET_NGHIEM_NHIEU_LAN;
    nhomThuoc = NHOM_THUOC;
    nhomBenh = NHOM_BENH;
    nhomNguong = NHOM_NGUONG;
    kieuGen = KIEU_GEN;
    maxYear: number = new Date().getFullYear();
    minYear: number = this.maxYear - 100;
    today: DateTime = DateTime.now();
    ngaySinh: DateTime = null;

    constructor(injector: Injector,
                private dataService: CaBenhServiceProxy,
                private fb: FormBuilder) {
        super(injector);
    }

    ngOnInit() {
        this.checkValidData();
    }

    checkValidData() {
        let input = new CheckValidImportExcelCaBenhRequest();
        input.listCaBenh = [];
        let caBenh = new CaBenhImportDto();
        caBenh.listError = [];
        caBenh.listDieuTriViemGanB = [];
        caBenh.listDieuTriViemGanC = [];
        let lanDieuTriViemGanB = 0;
        let lanDieuTriViemGanC = 0;
        let caBenh_DieuTri = new CaBenh_DieuTriDto();
        let caBenh_XetNghiem = new CaBenh_XetNghiemDto();
        let row = 3;
        let rowData = [];
        this.dataInput.splice(0, 1);
        this.dataInput.forEach(item => {
            rowData = Object.values(item);
            if (rowData[0] !== '' && rowData[1] !== '' && rowData[2] !== '' && rowData[4] !== '' && rowData[5] !== '' && rowData[6] !== '' && rowData[8] !== '') { //TH dòng dữ liệu đầu tiên của ca bệnh
                if (row > 3) { //Đẩy caBenh vào list trước khi tạo 1 ca bệnh mới
                    row++; //Cộng thêm dòng dữ liệu trắng
                    input.listCaBenh.push(caBenh);
                }
                caBenh = new CaBenhImportDto();
                caBenh.listError = [];
                caBenh.listDieuTriViemGanB = [];
                caBenh.listDieuTriViemGanC = [];
                lanDieuTriViemGanB = 0;
                lanDieuTriViemGanC = 0;
                if (rowData[0] !== '') {
                    caBenh.hoTen = rowData[0];
                } else {
                    caBenh.hoTen = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải nhập họ tên');
                }
                if (rowData[1] !== '') {
                    if (typeof (rowData[1]) === 'number' && rowData[1] > this.minYear && rowData[1] <= this.maxYear) {
                        caBenh.namSinh = rowData[1];
                        caBenh.tuoi = new Date().getFullYear() - caBenh.namSinh;
                        this.ngaySinh = DateTime.fromFormat(('01/01/' + caBenh.namSinh + ''), 'dd/MM/yyyy');
                    } else {
                        caBenh.namSinh = 0;
                        caBenh.tuoi = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Năm sinh phải là số và phải nhỏ hơn năm hiện tại');
                    }
                } else {
                    caBenh.namSinh = 0;
                    caBenh.tuoi = 0;
                    caBenh.listError.push('Dòng thứ ' + row + ' - Năm sinh là bắt buộc');
                }
                if (rowData[2] !== '') {
                    if (typeof (rowData[2]) === 'number' && (rowData[2] === 1 || rowData[2] === 0)) {
                        caBenh.gioiTinh = rowData[2];
                    } else {
                        caBenh.gioiTinh = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' -Giá trị của giới tính phải là 0 hoặc 1');
                    }
                } else {
                    caBenh.gioiTinh = null;
                    caBenh.listError.push('Dòng thứ ' + row + ' -Giá trị của giới tính phải là 0 hoặc 1');
                }
                caBenh.dienThoai = rowData[3];
                if (rowData[4] !== '') {
                    caBenh.tenTinh = rowData[4];
                } else {
                    caBenh.tenTinh = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải chọn Tỉnh/Thành phố');
                }
                if (rowData[5] !== '') {
                    caBenh.tenHuyen = rowData[5];
                } else {
                    caBenh.tenHuyen = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải chọn Quận/Huyện');
                }
                if (rowData[6] !== '') {
                    caBenh.tenXa = rowData[6];
                } else {
                    caBenh.tenXa = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải chọn Xã/Phường');
                }
                caBenh.diaChi = rowData[7];
                if (rowData[8] !== '') {
                    if (typeof (rowData[8]) === 'number' && rowData[8].toString().length < 13) {
                        caBenh.soCMND = rowData[8].toString();
                    } else {
                        caBenh.soCMND = rowData[8].toString();
                        caBenh.listError.push('Dòng thứ ' + row + ' - Phải nhập số CMND và ít hơn 12 số');
                    }
                    let checkSoCMND = input.listCaBenh.find(x => x.soCMND === caBenh.soCMND);
                    if (checkSoCMND) {
                        caBenh.listError.push('Dòng thứ ' + row + ' - Trùng lặp số CMND: ' + caBenh.soCMND + ' trong file import');
                    }
                }
                if (rowData[9] !== '') {
                    if (rowData[9].toString().length < 16) {
                        caBenh.soBHYT = rowData[9];
                    } else {
                        caBenh.soBHYT = rowData[9];
                        caBenh.listError.push('Dòng thứ ' + row + ' - BHYT không được lớn hơn 15 kí tự');
                    }
                } else {
                    caBenh.soBHYT = rowData[9];
                }
                if (rowData[10] !== '') {
                    caBenh.nhiemHIV = this.getBoolean(rowData[10]);
                }
                if (rowData[11] !== '') {
                    if (this.getKetQuaXetNghiem(rowData[11]) !== -1) {
                        caBenh.hBsAg_KetQua = this.getKetQuaXetNghiem(rowData[11]);
                    } else {
                        caBenh.hBsAg_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                        //caBenh.listError.push('Dòng thứ ' + row + ' - Giá trị của HBsAg là không hợp lệ');
                    }
                } else {
                    caBenh.hBsAg_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                }
                if (rowData[12] !== '') {
                    if (this.isDate(rowData[12])) {
                        caBenh.hBsAg_NgayLam = DateTime.fromFormat(rowData[12], 'dd/MM/yyyy');
                        if (DateTime.now().diff(caBenh.hBsAg_NgayLam, 'days').days < 0 || caBenh.hBsAg_NgayLam.diff(this.ngaySinh, 'days').days < 0) {
                            caBenh.hBsAg_NgayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HBsAg phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                        }
                    } else {
                        caBenh.hBsAg_NgayLam = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HBsAg không hợp lệ');
                    }
                } else {
                    caBenh.hBsAg_NgayLam = null;
                }
                if (rowData[13] !== '') {
                    if (this.getKetQuaXetNghiem(rowData[13]) !== -1) {
                        caBenh.antiHCV_KetQua = this.getKetQuaXetNghiem(rowData[13]);
                    } else {
                        caBenh.antiHCV_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                        //caBenh.listError.push('Dòng thứ ' + row + ' - Giá trị của AntiHCV phải là Dương tính hoặc âm tính');
                    }
                } else {
                    caBenh.antiHCV_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                }
                if (rowData[14] !== '') {
                    if (this.isDate(rowData[14])) {
                        caBenh.antiHCV_NgayLam = DateTime.fromFormat(rowData[14], 'dd/MM/yyyy');
                        if (DateTime.now().diff(caBenh.antiHCV_NgayLam, 'days').days < 0 || caBenh.antiHCV_NgayLam.diff(this.ngaySinh, 'days').days < 0) {
                            caBenh.antiHCV_NgayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm antiHCV phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                        }
                    } else {
                        caBenh.antiHCV_NgayLam = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm AntiHCV không hợp lệ');
                    }
                } else {
                    caBenh.antiHCV_NgayLam = null;
                }
                if (caBenh.antiHCV_KetQua === this.ketQuaXetNghiem.KHONG_XN && caBenh.hBsAg_KetQua === this.ketQuaXetNghiem.KHONG_XN) {
                    caBenh.listError.push('Phải có dữ liệu ít nhất 1 xét nghiệm HBsAg hoặc AntiHCV');
                }
                //Chỉ lấy các giá trị xét nghiệm viêm gan B nếu kết quả hBsAg  là Dương tính, nếu là âm tính hay không XN thì không cần lấy
                if (caBenh.hBsAg_KetQua === this.ketQuaXetNghiem.DUONG_TINH) {
                    if (rowData[15] !== '' && typeof (rowData[15]) === 'number') {
                        caBenh.plT_ChiSo = rowData[15];
                    } else {
                        caBenh.plT_ChiSo = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Chỉ số PLT phải là số');
                    }
                    if (rowData[16] !== '' && this.getChiSoPLT(rowData[16]) !== -1) {
                        caBenh.plT_DonVi = this.getChiSoPLT(rowData[16]);
                    } else {
                        caBenh.plT_DonVi = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Đơn vị PLT phải là số');
                    }
                    if (rowData[17] !== '' && typeof (rowData[17]) === 'number') {
                        caBenh.asT_ChiSo = rowData[17];
                    } else {
                        caBenh.asT_ChiSo = 0;
                        caBenh.listError.push('Dòng thứ ' + row + 'Chỉ số AST phải là số');
                    }
                    if (rowData[18] !== '' && typeof (rowData[18]) === 'number') {
                        caBenh.alT_ChiSo = rowData[18];
                    } else {
                        caBenh.alT_ChiSo = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Chỉ số ALT phải là số');
                    }
                    if (rowData[19] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[19]) !== -1) {
                            caBenh.hBeAb_KetQua = this.getKetQuaXetNghiem(rowData[19]);
                        } else {
                            caBenh.hBeAb_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + '- Kết quả XN HBeAb phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[20] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[20]) !== -1) {
                            caBenh.hBeAg_KetQua = this.getKetQuaXetNghiem(rowData[20]);
                        } else {
                            caBenh.hBeAg_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + '- Kết quả XN HBeAg phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[21] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[21]) !== -1) {
                            caBenh.antiHBe_KetQua = this.getKetQuaXetNghiem(rowData[21]);
                        } else {
                            caBenh.antiHBe_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + '- Kết quả XN AntiHBe phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[22] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[22]) !== -1) {
                            caBenh.antiHBs_KetQua = this.getKetQuaXetNghiem(rowData[22]);
                        } else {
                            caBenh.antiHBs_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + '- Kết quả XN AntiHBs phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[23] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[23]) !== -1) {
                            caBenh.antiHBcIgM_KetQua = this.getKetQuaXetNghiem(rowData[23]);
                        } else {
                            caBenh.antiHBcIgM_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + '- Kết quả XN AntiHBcIgM phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[24] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[24]) !== -1) {
                            caBenh.antiHBcIgG_KetQua = this.getKetQuaXetNghiem(rowData[24]);
                        } else {
                            caBenh.antiHBcIgG_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + '- Kết quả XN AntiHBcIgG phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[25] !== '' && typeof (rowData[25]) === 'number') {
                        caBenh.hbvdnA_ChiSo = rowData[25];
                    } else {
                        caBenh.hbvdnA_ChiSo = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Tải lượng HBV DNA phải là số');
                    }
                    if (rowData[26] !== '') {
                        if (this.isDate(rowData[26])) {
                            caBenh.hbvdnA_NgayLam = DateTime.fromFormat(rowData[26], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh.hbvdnA_NgayLam, 'days').days < 0 || caBenh.hbvdnA_NgayLam.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh.hbvdnA_NgayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HBVDNA phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh.hbvdnA_NgayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HBV DNA không hợp lệ');
                        }
                    } else {
                        caBenh.hbvdnA_NgayLam = null;
                    }
                    if (rowData[27] !== '') {
                        if (this.getNguong(rowData[27]) !== -1) {
                            caBenh.hbvdnA_Nguong = this.getNguong(rowData[27]);
                        } else {
                            caBenh.hbvdnA_Nguong = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngưỡng HBV DNA không hợp lệ');
                        }
                    } else {
                        caBenh.hbvdnA_Nguong = -1;
                    }
                    if (rowData[28] !== '') {
                        caBenh.viemGanBMan = this.getChanDoan(this.nhomBenh.VIEM_GAN_B, rowData[28]);
                    } else {
                        caBenh.viemGanBMan = false;
                    }
                } else {

                }
                //Chỉ lấy các giá trị xét nghiệm viêm gan C nếu kết quả Anti HCV là Dương tính, nếu là âm tính hay không XN thì không cần lấy
                if (caBenh.antiHCV_KetQua === this.ketQuaXetNghiem.DUONG_TINH) {
                    if (rowData[29] !== '') {
                        if (this.getKetQuaXetNghiem(rowData[29]) !== -1) {
                            caBenh.hcVcAg_KetQua = this.getKetQuaXetNghiem(rowData[29]);
                        } else {
                            caBenh.hcVcAg_KetQua = this.ketQuaXetNghiem.KHONG_XN;
                            //caBenh.listError.push('Dòng thứ ' + row + ' - Kết quả XN HcVcAg phải là Dương tính hoặc Âm tính');
                        }
                    }
                    if (rowData[30] !== '') {
                        if (typeof (rowData[30]) === 'number') {
                            caBenh.hcvarN_ChiSo = rowData[30];
                        } else {
                            caBenh.hcvarN_ChiSo = 0;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Tải lượng HCV RNA phải là số');
                        }
                    }
                    if (rowData[31] !== '') {
                        if (this.isDate(rowData[31])) {
                            caBenh.hcvarN_NgayLam = DateTime.fromFormat(rowData[31], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh.hcvarN_NgayLam, 'days').days < 0 || caBenh.hcvarN_NgayLam.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh.hcvarN_NgayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HCVARN phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh.hcvarN_NgayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HCV RNA không hợp lệ');
                        }
                    } else {
                        caBenh.hcvarN_NgayLam = null;
                    }
                    if (rowData[32] !== '') {
                        if (this.getNguong(rowData[32]) !== -1) {
                            caBenh.hcvarN_Nguong = this.getNguong(rowData[32]);
                        } else {
                            caBenh.hcvarN_Nguong = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngưỡng HCV RNA không hợp lệ');
                        }
                    } else {
                        caBenh.hcvarN_Nguong = -1;
                    }
                    if (rowData[33] !== '') {
                        if (typeof (rowData[33]) === 'number') {
                            caBenh.hcvGenotype_ChiSo = rowData[33];
                        } else {
                            caBenh.hcvGenotype_ChiSo = 0;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Tải lượng HCV Genotype phải là số');
                        }
                    } else {
                        caBenh.hcvGenotype_ChiSo = 0;
                    }
                    if (rowData[34] !== '') {
                        if (this.isDate(rowData[34])) {
                            caBenh.hcvGenotype_NgayLam = DateTime.fromFormat(rowData[34], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh.hcvGenotype_NgayLam, 'days').days < 0 || caBenh.hcvGenotype_NgayLam.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh.hcvGenotype_NgayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HCVGenotype phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh.hcvGenotype_NgayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày Xét nghiệm HCV Genotype không hợp lệ');
                        }
                    } else {
                        caBenh.hcvGenotype_NgayLam = null;
                    }
                    if (rowData[35] !== '') {
                        if (this.getGen(rowData[35]) !== -1) {
                            caBenh.hcvGenotype_KieuGen = this.getGen(rowData[35]);
                        } else {
                            caBenh.hcvGenotype_KieuGen = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Kiểu gen HCV Genotype không hợp lệ');
                        }
                    } else {
                        caBenh.hcvGenotype_KieuGen = -1;
                    }
                    if (rowData[36] !== '') {
                        caBenh.viemGanCMan = this.getChanDoan(this.nhomBenh.VIEM_GAN_C, rowData[36]);
                    } else {
                        caBenh.viemGanCMan = false;
                    }
                }

                //Điều trị viêm gan B - Chỉ lấy các giá trị khi chẩn đóan viêm gan B mạn
                if ((rowData[37] !== '' || rowData[42] !== '' || rowData[43] !== '') && rowData[28] !== '' && caBenh.viemGanBMan === true) {
                    caBenh_DieuTri = new CaBenh_DieuTriDto();
                    caBenh_DieuTri.listXetNghiem = [];
                    caBenh_DieuTri.id = 0;
                    caBenh_DieuTri.nhomBenh = this.nhomBenh.VIEM_GAN_B;
                    if (rowData[37] !== '') {
                        if (this.isDate(rowData[37])) {
                            caBenh_DieuTri.ngayBatDau = DateTime.fromFormat(rowData[37], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayBatDau, 'days').days < 0 || caBenh_DieuTri.ngayBatDau.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayBatDau = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan B phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_DieuTri.ngayBatDau = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan B không hợp lệ');
                        }
                    } else {
                        caBenh_DieuTri.ngayBatDau = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan B không hợp lệ');
                    }
                    if (rowData[38] !== '') {
                        if (this.isDate(rowData[38])) {
                            caBenh_DieuTri.ngayKetThuc = DateTime.fromFormat(rowData[38], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayKetThuc, 'days').days < 0 || caBenh_DieuTri.ngayKetThuc.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayKetThuc = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan B phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan B không hợp lệ');
                        }
                    } else {
                        caBenh_DieuTri.ngayKetThuc = null;
                    }
                    caBenh_DieuTri.thuocSuDung = rowData[42].replaceAll('\n', '').replaceAll('\r', '');
                    caBenh_DieuTri.jsonThuocSuDung = JSON.stringify(this.getListThuocDieuTri(this.nhomBenh.VIEM_GAN_B, caBenh_DieuTri.thuocSuDung));
                    if (rowData[43] !== '' && this.getKetQuaDieuTri(rowData[43]) !== -1) {
                        caBenh_DieuTri.ketQuaDieuTri = this.getKetQuaDieuTri(rowData[43]);
                    } else {
                        caBenh_DieuTri.ketQuaDieuTri = -1;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Kết quả điều trị viêm gan B không hợp lệ');
                    }
                    caBenh_DieuTri.isDeleted = false;
                    //Xet nghiem HBV DNA theo đợt điều trị
                    if (rowData[39] !== '' || rowData[40] !== '' || rowData[41] !== '') {
                        caBenh_XetNghiem = new CaBenh_XetNghiemDto();
                        caBenh_XetNghiem.id = 0;
                        caBenh_XetNghiem.caBenh_DieuTriId = 0;
                        caBenh_XetNghiem.tenXetNghiem = 'Tải lượng HBV DNA';
                        caBenh_XetNghiem.nhomXetNghiem = this.nhomXetNghiemNhieuLan.HBV_DNA;
                        if (rowData[39] !== '' && typeof (rowData[39]) === 'number') {
                            caBenh_XetNghiem.chiSo = rowData[39];
                        } else {
                            caBenh_XetNghiem.chiSo = 0;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Chỉ số HBV DNA không hợp lệ');
                        }
                        if (rowData[40] !== '') {
                            if (this.isDate(rowData[40])) {
                                caBenh_XetNghiem.ngayLam = DateTime.fromFormat(rowData[40], 'dd/MM/yyyy');
                                if (DateTime.now().diff(caBenh_XetNghiem.ngayLam, 'days').days < 0 || caBenh_XetNghiem.ngayLam.diff(this.ngaySinh, 'days').days < 0) {
                                    caBenh_XetNghiem.ngayLam = null;
                                    caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày Xét nghiệm HBV DNA phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                                }
                            } else {
                                caBenh_XetNghiem.ngayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm HBV DNA không hợp lệ');
                            }
                        } else {
                            caBenh_XetNghiem.ngayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm HBV DNA không hợp lệ');
                        }
                        if (rowData[41] !== '' && this.getNguong(rowData[41]) !== -1) {
                            caBenh_XetNghiem.nguong = this.getNguong(rowData[41]);
                        } else {
                            caBenh_XetNghiem.nguong = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngưỡng HBV DNA không hợp lệ');
                        }
                        caBenh_XetNghiem.isDeleted = false;
                        caBenh_DieuTri.listXetNghiem.push(
                            caBenh_XetNghiem,
                        );
                    }
                    caBenh.listDieuTriViemGanB.push(caBenh_DieuTri);
                    lanDieuTriViemGanB = lanDieuTriViemGanB + 1;
                }
                //Điều trị viêm gan C - Chỉ lấy các giá trị khi chẩn đoán viêm gan C mạn
                if ((rowData[44] !== '' || rowData[49] !== '' || rowData[50] !== '') && rowData[36] !== '' && caBenh.viemGanCMan === true) {
                    caBenh_DieuTri = new CaBenh_DieuTriDto();
                    caBenh_DieuTri.listXetNghiem = [];
                    caBenh_DieuTri.id = 0;
                    caBenh_DieuTri.nhomBenh = this.nhomBenh.VIEM_GAN_C;

                    if (rowData[44] !== '') {
                        if (this.isDate(rowData[44])) {
                            caBenh_DieuTri.ngayBatDau = DateTime.fromFormat(rowData[44], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayBatDau, 'days').days < 0 || caBenh_DieuTri.ngayBatDau.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayBatDau = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_DieuTri.ngayBatDau = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C không hợp lệ');
                        }

                    } else {
                        caBenh_DieuTri.ngayBatDau = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C không hợp lệ');
                    }
                    if (rowData[45] !== '') {
                        if (this.isDate(rowData[45])) {
                            caBenh_DieuTri.ngayKetThuc = DateTime.fromFormat(rowData[45], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayKetThuc, 'days').days < 0 || caBenh_DieuTri.ngayKetThuc.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayBatDau = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_DieuTri.ngayKetThuc = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan C không hợp lệ');
                        }
                    } else {
                        caBenh_DieuTri.ngayKetThuc = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan C không hợp lệ');
                    }
                    caBenh_DieuTri.thuocSuDung = rowData[49].replaceAll('\n', '').replaceAll('\r', '');
                    caBenh_DieuTri.jsonThuocSuDung = JSON.stringify(this.getListThuocDieuTri(this.nhomBenh.VIEM_GAN_C, caBenh_DieuTri.thuocSuDung));
                    if (rowData[50] !== '' && this.getKetQuaDieuTri(rowData[50]) !== -1) {
                        caBenh_DieuTri.ketQuaDieuTri = this.getKetQuaDieuTri(rowData[50]);
                    } else {
                        caBenh_DieuTri.ketQuaDieuTri = -1;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Kết quả điều trị viêm gan C không hợp lệ');
                    }

                    caBenh_DieuTri.isDeleted = false;

                    //Xet nghiem HCV RNA theo đợt điều trị
                    if (rowData[46] !== '' || rowData[47] !== '' || rowData[48] !== '') {
                        caBenh_XetNghiem = new CaBenh_XetNghiemDto();
                        caBenh_XetNghiem.id = 0;
                        caBenh_XetNghiem.caBenh_DieuTriId = 0;
                        caBenh_XetNghiem.tenXetNghiem = 'Tải lượng HCV RNA';
                        caBenh_XetNghiem.nhomXetNghiem = this.nhomXetNghiemNhieuLan.HCV_ARN;
                        if (rowData[46] !== '' && typeof (rowData[46]) === 'number') {
                            caBenh_XetNghiem.chiSo = rowData[46];
                        } else {
                            caBenh_XetNghiem.chiSo = 0;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Chỉ số xét nghiệm SVR12 không hợp lệ');
                        }
                        if (rowData[47] !== '') {
                            if (this.isDate(rowData[47])) {
                                caBenh_XetNghiem.ngayLam = DateTime.fromFormat(rowData[47], 'dd/MM/yyyy');
                                if (DateTime.now().diff(caBenh_XetNghiem.ngayLam, 'days').days < 0 || caBenh_XetNghiem.ngayLam.diff(this.ngaySinh, 'days').days < 0) {
                                    caBenh_XetNghiem.ngayLam = null;
                                    caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày Xét nghiệm SVR12 phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                                }
                            } else {
                                caBenh_XetNghiem.ngayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm xét nghiệm SVR12 không hợp lệ');
                            }
                        } else {
                            caBenh_XetNghiem.ngayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm xét nghiệm SVR12 không hợp lệ');
                        }
                        if (rowData[48] !== '' && this.getNguong(rowData[48]) !== -1) {
                            caBenh_XetNghiem.nguong = this.getNguong(rowData[48]);
                        } else {
                            caBenh_XetNghiem.nguong = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngưỡng xét nghiệm SVR12 không hợp lệ');
                        }
                        caBenh_XetNghiem.isDeleted = false;
                        caBenh_DieuTri.listXetNghiem.push(
                            caBenh_XetNghiem,
                        );
                    }
                    caBenh.listDieuTriViemGanC.push(caBenh_DieuTri);
                    lanDieuTriViemGanC = lanDieuTriViemGanC + 1;
                }
                if (rowData[51] !== '') {
                    caBenh.tuVong = this.getBoolean(rowData[51]);
                }
                if (caBenh.tuVong === true) {
                    if (rowData[52] !== '') {
                        if (this.isDate(rowData[52])) {
                            caBenh.ngayTuVong = DateTime.fromFormat(rowData[52], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh.ngayTuVong, 'days').days < 0 || caBenh.ngayTuVong.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh.ngayTuVong = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày tử vong phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh.ngayTuVong = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày tử vong không hợp lệ');
                        }
                    } else {
                        caBenh.ngayTuVong = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ca bệnh tử vong phải có ngày tử vong');
                    }
                }
            } else if (rowData[0] === '' && rowData[1] === '' && rowData[2] === '' && rowData[4] === '' && rowData[5] === '' && rowData[6] === '' && rowData[8] === '') { //Trường hợp là bản ghi xét nghiệm hoặc điều trị
                //Điều trị viêm gan B - Chỉ lấy khi viêm gan B mạn
                if ((rowData[37] !== '' || rowData[42] !== '' || rowData[43] !== '') && rowData[28] !== '' && caBenh.viemGanBMan === true) { //Điều trị mới
                    caBenh_DieuTri = new CaBenh_DieuTriDto();
                    caBenh_DieuTri.listXetNghiem = [];
                    caBenh_DieuTri.id = 0;
                    caBenh_DieuTri.nhomBenh = this.nhomBenh.VIEM_GAN_B;
                    if (rowData[37] !== '') {
                        if (this.isDate(rowData[37])) {
                            caBenh_DieuTri.ngayBatDau = DateTime.fromFormat(rowData[37], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayBatDau, 'days').days < 0 || caBenh_DieuTri.ngayBatDau.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayBatDau = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan B phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_DieuTri.ngayBatDau = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan B không hợp lệ');
                        }
                    } else {
                        caBenh_DieuTri.ngayBatDau = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan B không hợp lệ');
                    }
                    if (rowData[38] !== '') {
                        if (this.isDate(rowData[38])) {
                            caBenh_DieuTri.ngayKetThuc = DateTime.fromFormat(rowData[38], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayKetThuc, 'days').days < 0 || caBenh_DieuTri.ngayKetThuc.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayKetThuc = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan B phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan B không hợp lệ');
                        }
                    } else {
                        caBenh_DieuTri.ngayKetThuc = null;
                    }
                    caBenh_DieuTri.thuocSuDung = rowData[42].replaceAll('\n', '').replaceAll('\r', '');
                    caBenh_DieuTri.jsonThuocSuDung = JSON.stringify(this.getListThuocDieuTri(this.nhomBenh.VIEM_GAN_B, caBenh_DieuTri.thuocSuDung));
                    if (rowData[43] !== '' && this.getKetQuaDieuTri(rowData[43]) !== -1) {
                        caBenh_DieuTri.ketQuaDieuTri = this.getKetQuaDieuTri(rowData[43]);
                    } else {
                        caBenh_DieuTri.ketQuaDieuTri = -1;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Kết quả điều trị viêm gan B không hợp lệ');
                    }
                    caBenh_DieuTri.isDeleted = false;
                    //Xet nghiem HBV DNA theo đợt điều trị
                    if (rowData[39] !== '' || rowData[40] !== '' || rowData[41] !== '') {
                        caBenh_XetNghiem = new CaBenh_XetNghiemDto();
                        caBenh_XetNghiem.id = 0;
                        caBenh_XetNghiem.caBenh_DieuTriId = 0;
                        caBenh_XetNghiem.tenXetNghiem = 'Tải lượng HBV DNA';
                        caBenh_XetNghiem.nhomXetNghiem = this.nhomXetNghiemNhieuLan.HBV_DNA;
                        if (rowData[39] !== '' && typeof (rowData[39]) === 'number') {
                            caBenh_XetNghiem.chiSo = rowData[39];
                        } else {
                            caBenh_XetNghiem.chiSo = 0;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Chỉ số HBV DNA không hợp lệ');
                        }
                        if (rowData[40] !== '') {
                            if (this.isDate(rowData[40])) {
                                caBenh_XetNghiem.ngayLam = DateTime.fromFormat(rowData[40], 'dd/MM/yyyy');
                                if (DateTime.now().diff(caBenh_XetNghiem.ngayLam, 'days').days < 0 || caBenh_XetNghiem.ngayLam.diff(this.ngaySinh, 'days').days < 0) {
                                    caBenh_XetNghiem.ngayLam = null;
                                    caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày Xét nghiệm HBV DNA phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                                }
                            } else {
                                caBenh_XetNghiem.ngayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm HBV DNA không hợp lệ');
                            }
                        } else {
                            caBenh_XetNghiem.ngayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm HBV DNA không hợp lệ');
                        }
                        if (rowData[41] !== '' && this.getNguong(rowData[41]) !== -1) {
                            caBenh_XetNghiem.nguong = this.getNguong(rowData[41]);
                        } else {
                            caBenh_XetNghiem.nguong = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngưỡng HBV DNA không hợp lệ');
                        }

                        caBenh_XetNghiem.isDeleted = false;
                        caBenh_DieuTri.listXetNghiem.push(
                            caBenh_XetNghiem,
                        );
                    }
                    caBenh.listDieuTriViemGanB.push(caBenh_DieuTri);
                    lanDieuTriViemGanB = lanDieuTriViemGanB + 1;
                } else if ((rowData[39] !== '' || rowData[40] !== '' || rowData[41] !== '') && rowData[28] !== '' && caBenh.viemGanBMan === true) { //Xét nghiệm từ lần 2 trong đợt điều trị viêm gan B
                    caBenh_XetNghiem = new CaBenh_XetNghiemDto();
                    caBenh_XetNghiem.id = 0;
                    caBenh_XetNghiem.caBenh_DieuTriId = 0;
                    caBenh_XetNghiem.tenXetNghiem = 'Tải lượng HBV DNA';
                    caBenh_XetNghiem.nhomXetNghiem = this.nhomXetNghiemNhieuLan.HBV_DNA;
                    if (rowData[39] !== '' && typeof (rowData[39]) === 'number') {
                        caBenh_XetNghiem.chiSo = rowData[39];
                    } else {
                        caBenh_XetNghiem.chiSo = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Chỉ số HBV DNA không hợp lệ');
                    }
                    if (rowData[40] !== '') {
                        if (this.isDate(rowData[40])) {
                            caBenh_XetNghiem.ngayLam = DateTime.fromFormat(rowData[40], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_XetNghiem.ngayLam, 'days').days < 0 || caBenh_XetNghiem.ngayLam.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_XetNghiem.ngayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày Xét nghiệm HBV DNA phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_XetNghiem.ngayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' Điều trị - Ngày làm HBV DNA không hợp lệ');
                        }

                    } else {
                        caBenh_XetNghiem.ngayLam = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' Điều trị - Ngày làm HBV DNA không hợp lệ');
                    }
                    if (rowData[41] !== '' && this.getNguong(rowData[41]) !== -1) {
                        caBenh_XetNghiem.nguong = this.getNguong(rowData[41]);
                    } else {
                        caBenh_XetNghiem.nguong = -1;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngưỡng HBV DNA không hợp lệ');
                    }
                    caBenh_XetNghiem.isDeleted = false;
                    let caBenh_DieuTri_XetNghiem = caBenh.listDieuTriViemGanB[lanDieuTriViemGanB - 1];
                    caBenh_DieuTri_XetNghiem.listXetNghiem.push(
                        caBenh_XetNghiem,
                    );
                }
                //Điều trị viêm gan C - Chỉ lấy khi viêm gan C mạn
                if ((rowData[44] !== '' || rowData[49] !== '' || rowData[50] !== '') && rowData[36] !== '' && caBenh.viemGanCMan === true) {
                    caBenh_DieuTri = new CaBenh_DieuTriDto();
                    caBenh_DieuTri.listXetNghiem = [];
                    caBenh_DieuTri.id = 0;
                    caBenh_DieuTri.nhomBenh = this.nhomBenh.VIEM_GAN_C;

                    if (rowData[44] !== '') {
                        if (this.isDate(rowData[44])) {
                            caBenh_DieuTri.ngayBatDau = DateTime.fromFormat(rowData[44], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayBatDau, 'days').days < 0 || caBenh_DieuTri.ngayBatDau.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayBatDau = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_DieuTri.ngayBatDau = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C không hợp lệ');
                        }
                    } else {
                        caBenh_DieuTri.ngayBatDau = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C không hợp lệ');
                    }
                    if (rowData[45] !== '') {
                        if (this.isDate(rowData[45])) {
                            caBenh_DieuTri.ngayKetThuc = DateTime.fromFormat(rowData[45], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_DieuTri.ngayKetThuc, 'days').days < 0 || caBenh_DieuTri.ngayKetThuc.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_DieuTri.ngayKetThuc = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Ngày bắt đầu điều trị viêm gan C phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_DieuTri.ngayKetThuc = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan C không hợp lệ');
                        }

                    } else {
                        caBenh_DieuTri.ngayKetThuc = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Ngày kết thúc điều trị viêm gan C không hợp lệ');
                    }
                    caBenh_DieuTri.thuocSuDung = rowData[49].replaceAll('\n', '').replaceAll('\r', '');
                    caBenh_DieuTri.jsonThuocSuDung = JSON.stringify(this.getListThuocDieuTri(this.nhomBenh.VIEM_GAN_C, caBenh_DieuTri.thuocSuDung));
                    if (rowData[50] !== '' && this.getKetQuaDieuTri(rowData[50]) !== -1) {
                        caBenh_DieuTri.ketQuaDieuTri = this.getKetQuaDieuTri(rowData[50]);
                    } else {
                        caBenh_DieuTri.ketQuaDieuTri = -1;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Kết quả điều trị viêm gan C không hợp lệ');
                    }

                    caBenh_DieuTri.isDeleted = false;

                    //Xet nghiem HCV RNA theo đợt điều trị
                    if (rowData[46] !== '' || rowData[47] !== '' || rowData[48] !== '') {
                        caBenh_XetNghiem = new CaBenh_XetNghiemDto();
                        caBenh_XetNghiem.id = 0;
                        caBenh_XetNghiem.caBenh_DieuTriId = 0;
                        caBenh_XetNghiem.tenXetNghiem = 'Tải lượng HCV RNA';
                        caBenh_XetNghiem.nhomXetNghiem = this.nhomXetNghiemNhieuLan.HCV_ARN;
                        if (rowData[46] !== '' && typeof (rowData[46]) === 'number') {
                            caBenh_XetNghiem.chiSo = rowData[46];
                        } else {
                            caBenh_XetNghiem.chiSo = 0;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Chỉ số xét nghiệm SVR12 không hợp lệ');
                        }
                        if (rowData[47] !== '') {
                            if (this.isDate(rowData[47])) {
                                caBenh_XetNghiem.ngayLam = DateTime.fromFormat(rowData[47], 'dd/MM/yyyy');
                                if (DateTime.now().diff(caBenh_XetNghiem.ngayLam, 'days').days < 0 || caBenh_XetNghiem.ngayLam.diff(this.ngaySinh, 'days').days < 0) {
                                    caBenh_XetNghiem.ngayLam = null;
                                    caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày Xét nghiệm SVR12 phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                                }
                            } else {
                                caBenh_XetNghiem.ngayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm xét nghiệm SVR12 không hợp lệ');
                            }
                        } else {
                            caBenh_XetNghiem.ngayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày làm xét nghiệm SVR12 không hợp lệ');
                        }
                        if (rowData[48] !== '' && this.getNguong(rowData[48]) !== -1) {
                            caBenh_XetNghiem.nguong = this.getNguong(rowData[48]);
                        } else {
                            caBenh_XetNghiem.nguong = -1;
                            caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngưỡng xét nghiệm SVR12 không hợp lệ');
                        }
                        caBenh_XetNghiem.isDeleted = false;
                        caBenh_DieuTri.listXetNghiem.push(
                            caBenh_XetNghiem,
                        );
                    }
                    caBenh.listDieuTriViemGanC.push(caBenh_DieuTri);
                    lanDieuTriViemGanC = lanDieuTriViemGanC + 1;

                } else if ((rowData[46] !== '' || rowData[47] !== '' || rowData[48] !== '') && rowData[36] !== '' && caBenh.viemGanCMan === true) { //Xét nghiệm lần 2 trong đợt điều trị viêm gan C
                    caBenh_XetNghiem = new CaBenh_XetNghiemDto();
                    caBenh_XetNghiem.id = 0;
                    caBenh_XetNghiem.caBenh_DieuTriId = 0;
                    caBenh_XetNghiem.tenXetNghiem = 'Tải lượng HCV RNA';
                    caBenh_XetNghiem.nhomXetNghiem = this.nhomXetNghiemNhieuLan.HCV_ARN;
                    if (rowData[46] !== '' && typeof (rowData[46]) === 'number') {
                        caBenh_XetNghiem.chiSo = rowData[46];
                    } else {
                        caBenh_XetNghiem.chiSo = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Điểu trị - Chỉ số xét nghiệm SVR12 không hợp lệ');
                    }
                    if (rowData[47] !== '') {
                        if (this.isDate(rowData[47])) {
                            caBenh_XetNghiem.ngayLam = DateTime.fromFormat(rowData[47], 'dd/MM/yyyy');
                            if (DateTime.now().diff(caBenh_XetNghiem.ngayLam, 'days').days < 0 || caBenh_XetNghiem.ngayLam.diff(this.ngaySinh, 'days').days < 0) {
                                caBenh_XetNghiem.ngayLam = null;
                                caBenh.listError.push('Dòng thứ ' + row + ' - Điều trị - Ngày Xét nghiệm SVR12 phải lớn hơn ngày sinh và nhỏ hơn ngày hiện tại');
                            }
                        } else {
                            caBenh_XetNghiem.ngayLam = null;
                            caBenh.listError.push('Dòng thứ ' + row + '- Điểu trị - Ngày làm xét nghiệm SVR12 không hợp lệ');
                        }
                    } else {
                        caBenh_XetNghiem.ngayLam = null;
                        caBenh.listError.push('Dòng thứ ' + row + '- Điểu trị - Ngày làm xét nghiệm SVR12 không hợp lệ');
                    }
                    if (rowData[48] !== '' && this.getNguong(rowData[48]) !== -1) {
                        caBenh_XetNghiem.nguong = this.getNguong(rowData[48]);
                    } else {
                        caBenh_XetNghiem.nguong = -1;
                        caBenh.listError.push('Dòng thứ ' + row + '- Điểu trị - Ngưỡng xét nghiệm SVR12 không hợp lệ');
                    }
                    caBenh_XetNghiem.isDeleted = false;

                    let caBenh_DieuTri_XetNghiem = caBenh.listDieuTriViemGanC[lanDieuTriViemGanC - 1];
                    caBenh_DieuTri_XetNghiem.listXetNghiem.push(
                        caBenh_XetNghiem,
                    );
                }

            } else {
                caBenh = new CaBenhImportDto();
                lanDieuTriViemGanB = 0;
                lanDieuTriViemGanC = 0;
                if (rowData[0] !== '') {
                    caBenh.hoTen = rowData[0];
                } else {
                    caBenh.hoTen = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải nhập họ tên');
                }
                if (rowData[1] !== '') {
                    if (typeof (rowData[1]) === 'number' && rowData[1] > this.minYear && rowData[1] <= this.maxYear) {
                        caBenh.namSinh = rowData[1];
                        caBenh.tuoi = new Date().getFullYear() - caBenh.namSinh;
                        this.ngaySinh = DateTime.fromFormat(('01/01/' + caBenh.namSinh + ''), 'dd/MM/yyyy');
                    } else {
                        caBenh.namSinh = 0;
                        caBenh.tuoi = 0;
                        caBenh.listError.push('Dòng thứ ' + row + ' - Năm sinh phải là số và phải nhỏ hơn năm hiện tại');
                    }
                } else {
                    caBenh.namSinh = 0;
                    caBenh.tuoi = 0;
                    caBenh.listError.push('Dòng thứ ' + row + ' - Năm sinh là bắt buộc');
                }

                if (rowData[2] !== '') {
                    if (typeof (rowData[2]) === 'number' && (rowData[2] === 1 || rowData[2] === 0)) {
                        caBenh.gioiTinh = rowData[2];
                    } else {
                        caBenh.gioiTinh = null;
                        caBenh.listError.push('Dòng thứ ' + row + ' -Giá trị của giới tính phải là 0 hoặc 1');
                    }
                } else {
                    caBenh.gioiTinh = null;
                    caBenh.listError.push('Dòng thứ ' + row + ' -Giá trị của giới tính phải là 0 hoặc 1');
                }
                caBenh.dienThoai = rowData[3];
                if (rowData[4] !== '') {
                    caBenh.tenTinh = rowData[4];
                } else {
                    caBenh.tenTinh = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải nhập tên tỉnh');
                }
                if (rowData[5] !== '') {
                    caBenh.tenHuyen = rowData[5];
                } else {
                    caBenh.tenHuyen = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải nhập tên huyện');
                }
                if (rowData[6] !== '') {
                    caBenh.tenXa = rowData[6];
                } else {
                    caBenh.tenXa = '';
                    caBenh.listError.push('Dòng thứ ' + row + 'Phải nhập tên xã');
                }
                caBenh.diaChi = rowData[7];
                if (rowData[8] !== '') {
                    if (typeof (rowData[8]) === 'number' && rowData[8].toString().length < 13) {
                        caBenh.soCMND = rowData[8].toString();
                    } else {
                        caBenh.soCMND = rowData[8].toString();
                        caBenh.listError.push('Dòng thứ ' + row + ' - Phải nhập số CMND và không quá 12 số');
                    }
                }
            }
            row++;
        });
        input.listCaBenh.push(caBenh); //Đẩy dữ liệu cuối
        input.listCaBenh.forEach(item => {
            let dieuTriViemGanG = _.cloneDeep(item.listDieuTriViemGanB);
            if (dieuTriViemGanG.length > 0) {
                let dieuTriViemGanBSort = _.sortBy(dieuTriViemGanG, 'ngayBatDau');
                item.soLanDieuTri_ViemGanB = dieuTriViemGanBSort.length;
                let dieuTri = dieuTriViemGanBSort[dieuTriViemGanBSort.length - 1];
                item.ketQuaDieuTri_ViemGanB = dieuTri.ketQuaDieuTri;
                item.ngayBatDau_ViemGanB = dieuTri.ngayBatDau;
                item.ngayKetThuc_ViemGanB = dieuTri.ngayKetThuc;
                if (dieuTri.listXetNghiem.length > 0) {
                    item.hbvdnA_LanCuoi_NgayLam = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].ngayLam;
                    item.hbvdnA_LanCuoi_Nguong = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].nguong;
                }
            }
            let dieuTriViemGanC = _.cloneDeep(item.listDieuTriViemGanC);
            if (dieuTriViemGanC.length > 0) {
                let dieuTriViemGanCSort = _.sortBy(dieuTriViemGanC, 'ngayBatDau');
                item.soLanDieuTri_ViemGanC = dieuTriViemGanCSort.length;
                let dieuTri = dieuTriViemGanCSort[dieuTriViemGanCSort.length - 1];
                item.ketQuaDieuTri_ViemGanC = dieuTri.ketQuaDieuTri;
                item.ngayBatDau_ViemGanC = dieuTri.ngayBatDau;
                item.ngayKetThuc_ViemGanC = dieuTri.ngayKetThuc;
                if (dieuTri.listXetNghiem.length > 0) {
                    item.hcvarN_LanCuoi_NgayLam = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].ngayLam;
                    item.hcvarN_LanCuoi_Nguong = dieuTri.listXetNghiem[dieuTri.listXetNghiem.length - 1].nguong;
                }
            }
        });
        this.dataService.checkValidImportExcelCaBenh(input).subscribe(result => {
            this.dataImport = result;
        });
    }

    isDate(sDate) {
        if (typeof (sDate) !== 'number') {
            let check = DateTime.fromFormat(sDate, 'dd/MM/yyyy');
            if (check.invalidExplanation === null && check.invalidReason === null) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getBoolean(sBoolean) {
        let sboolean = sBoolean.toLowerCase().trim();
        if (sboolean === 'có') {
            return true;
        } else if (sboolean === 'không') {
            return false;
        } else {
            return false;
        }
    }

    getNguong(sNguong) {
        let snguong = sNguong.toLowerCase().trim();
        if (snguong === 'trên ngưỡng') {
            return this.nhomNguong.TREN_NGUONG;
        } else if (snguong === 'dưới ngưỡng') {
            return this.nhomNguong.DUOI_NGUONG;
        } else {
            return -1;
        }
    }

    getKetQuaDieuTri(sKetQua) {
        let sketqua = sKetQua.toLowerCase().trim();
        if (sketqua === 'nghi ngờ' || sketqua === 'nghi ngờ') {
            return this.ketQuaDieuTri.NGHI_NGO;
        } else if (sketqua === 'lành tính' || sketqua === 'lành tính') {
            return this.ketQuaDieuTri.LANH_TINH;
        } else if (sketqua === 'ác tính') {
            return this.ketQuaDieuTri.AC_TINH;
        } else {
            return -1;
        }
    }

    getKetQuaXetNghiem(sXetNghiem) {
        let sxetnghiem = sXetNghiem.toLowerCase().trim();
        let sxetnghemremove = AppUtilityService.removeDau(sXetNghiem);
        if (sxetnghiem === 'dương tính' || sxetnghiem === 'dương tính' || sxetnghemremove === 'duong tinh') {
            return this.ketQuaXetNghiem.DUONG_TINH;
        } else if (sxetnghiem === 'âm tính' || sxetnghiem === 'âm tính' || sxetnghemremove === 'duong tinh') {
            return this.ketQuaXetNghiem.AM_TINH;
        } else if (sxetnghiem === 'không xét nghiệm' || sxetnghiem === 'không xét nghiệm' || sxetnghemremove === 'khong xet nghiem') {
            return this.ketQuaXetNghiem.KHONG_XN;
        } else {
            return -2;
        }
    }

    getGen(strGen) {
        if (strGen === 1) {
            return this.kieuGen.GEN_1;
        } else if (strGen === 2) {
            return this.kieuGen.GEN_2;
        } else if (strGen === 3) {
            return this.kieuGen.GEN_3;
        } else if (strGen === 4) {
            return this.kieuGen.GEN_4;
        } else if (strGen === 4) {
            return this.kieuGen.GEN_5;
        } else if (strGen === 6) {
            return this.kieuGen.GEN_6;
        } else {
            return -1;
        }
    }

    getChiSoPLT(strChiSo) {
        let strchiso = strChiSo.toLowerCase().trim();
        if (strchiso === 'u/l') {
            return this.donViChiSo.UL;
        } else if (strchiso === 'k/ul') {
            return this.donViChiSo.KUL;
        } else if (strchiso === 'g/l') {
            return this.donViChiSo.GL;
        } else if (strchiso === '10^9/l') {
            return this.donViChiSo.L109;
        } else {
            return -1;
        }
    }

    getListThuocDieuTri(loaiBenh, thuocSuDung) {
        let arrThuoc = [];
        let arrThuocImport: string[] = thuocSuDung.split(';');
        if (loaiBenh === this.nhomBenh.VIEM_GAN_B) {
            arrThuoc = _.cloneDeep(this.thuocDieuTriViemGanB);
            arrThuocImport.forEach(item => {
                if (item.length > 0) {
                    let check = arrThuoc.findIndex(x => x.label.toLowerCase().trim() === item.toLowerCase().trim());
                    if (check > -1) {
                        arrThuoc[check]['checked'] = true;
                    }
                }

            });
        } else {
            arrThuoc = _.cloneDeep(this.thuocDieuTriViemGanC);
            arrThuocImport.forEach(item => {
                if (item.length > 0) {
                    let check = arrThuoc.findIndex(x => x.label.toLowerCase().trim() === item.toLowerCase().trim());
                    if (check > -1) {
                        arrThuoc[check]['checked'] = true;
                    }
                }
            });
        }
        return arrThuoc;

    }

    getChanDoan(loaiBenh, sChanDoan) {
        let schandoan = sChanDoan.replaceAll('\n', '').toLowerCase().trim();
        if (loaiBenh === this.nhomBenh.VIEM_GAN_B) {
            if (schandoan === 'viêm gan b mạn') {
                return true;
            } else {
                return false;
            }
        }
        if (loaiBenh === this.nhomBenh.VIEM_GAN_C) {
            if (schandoan === 'viêm gan c mạn') {
                return true;
            } else {
                return false;
            }
        }
    }

    save() {
        let input = new UploadExcelCaBenhRequest();
        input.listCaBenh = this.dataImport;
        this.dataService.uploadExcelCaBenh(input).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.success(true);
        });
    }

    viewError(dataItem?: any): void {
        this.modalHelper.create(ViewErrorImportCaBenhComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: false,
                modalOptions: {
                    nzTitle: dataItem ? 'Xem chi tiết lỗi: ' + dataItem.hoTen : '',
                },
            })
            .subscribe(result => {
                if (result) {
                    //this.refresh();
                }
            });
    }

    onBackToList($event: boolean) {

    }

    delete(dataItem: any): void {

    }
}
