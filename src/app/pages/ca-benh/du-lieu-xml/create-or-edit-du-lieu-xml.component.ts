import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import {
    CaBenh_DieuTriDto,
    CaBenh_XetNghiemDto,
    CaBenhImportDto,
    DuLieuXMLDto,
    DuLieuXMLServiceProxy,
    FileErrorDto,
    TRANG_THAI_DU_LIEU_XML,
    UploadXMLCaBenhRequest,
} from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs/internal/Subject';
import { NzUploadFile } from '@node_modules/ng-zorro-antd/upload';
import { AppConsts } from '@shared/AppConsts';


@Component({
    selector: 'create-or-update-du-lieu-xml',
    templateUrl: './create-or-edit-du-lieu-xml.component.html',
    encapsulation: ViewEncapsulation.Emulated,
})
export class CreateOrEditDuLieuXmlComponent extends AppComponentBase implements OnInit, OnDestroy {
    $destroy: Subject<boolean> = new Subject<boolean>();
    rfDataModal: FormGroup;
    @Input() duLieuXmlId: number;
    @Input() nam: number;
    @Input() thang: number;
    @Input() isView: boolean;
    @Output() backListEvent = new EventEmitter<boolean>();
    id = 0;
    maHoa = 1;
    headerTitle = '';
    saving = false;
    maxYear: number = new Date().getFullYear();
    fileList: any[] = [];
    url = '';
    dataReadXML = [];
    listCaBenh: CaBenhImportDto[] = [];
    dataHopLe: CaBenhImportDto[] = [];
    dataKhongHopLe: CaBenhImportDto[] = [];
    listFileError: FileErrorDto[] = [];
    filePath = '';
    error = '';
    optionMaHoa = [
        {
            name: 'Không mã hóa dữ liệu',
            id: 0,
        },
        {
            name: 'Có mã hóa dữ liệu',
            id: 1,
        },
        {
            name: 'Nhiều ca bệnh, mã hóa dữ liệu',
            id: 2,
        },
    ];

    constructor(
        injector: Injector,
        private _dataService: DuLieuXMLServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    ngOnInit(): void {
        this.rfDataModal = this.fb.group({
            maHoa: [1],
        });
        this.headerTitle = 'Liên thông dữ liệu tháng ' + this.thang + ' năm ' + this.nam;
        this.url = AppConsts.remoteServiceBaseUrl + '/FileUpload/UploadLienThong?nam=' + this.nam + '&thang=' + this.thang + '&maHoa=' + this.maHoa;
        console.log(this.duLieuXmlId, 'id')
    }

    changeMaHoa(event) {
        this.maHoa = event;
        this.url = AppConsts.remoteServiceBaseUrl + '/FileUpload/UploadLienThong?nam=' + this.nam + '&thang=' + this.thang + '&maHoa=' + this.maHoa;
    }

    ngOnDestroy(): void {
    }

    close(isSave: boolean) {
        this.backListEvent.emit(isSave);
    }

    save(): void {
        this.saving = true;
        let duLieuXML = new DuLieuXMLDto();
        duLieuXML.id = this.duLieuXmlId;
        duLieuXML.nam = this.nam;
        duLieuXML.thang = this.thang;
        duLieuXML.trangThai = TRANG_THAI_DU_LIEU_XML.DA_UPLOAD;
        duLieuXML.duongDan = this.filePath;
        duLieuXML.soFile = this.dataReadXML.length;
        duLieuXML.soHopLe = this.dataReadXML.filter(x => x.trangThaiImport === 1).length;
        duLieuXML.soHopLeCu = this.dataReadXML.filter(x => x.trangThaiImport === 1 && x.id > 0).length;
        duLieuXML.soKhongHopLe = this.dataReadXML.filter(x => x.trangThaiImport === 0).length;
        duLieuXML.jsonKhongHopLe = JSON.stringify(this.dataReadXML.filter(x => x.trangThaiImport === 0));
        duLieuXML.soLoiCauTruc = this.listFileError.length;
        duLieuXML.jsonLoiCauTruc = JSON.stringify(this.listFileError);
        let input = new UploadXMLCaBenhRequest();
        input.listCaBenh = this.listCaBenh;
        input.duLieuXML = duLieuXML;
        this._dataService.uploadXMLCaBenhBackgroundJob(input).subscribe((result) => {
            if (result.isSuccessful) {
                this.notify.info('Đã upload thành công dữ liệu XML lên hệ thống. Hệ thống sẽ cần 1 khoảng thời gian để đồng bộ dữ liệu!!');
                //this.success(true);
                this.saving = false;
                this.backListEvent.emit(false);
            } else {
                this.notify.error(result.errorMessage);
                this.saving = false;
            }
        });
    }

    saveAndSync(): void {
        this.saving = true;
        let duLieuXML = new DuLieuXMLDto();
        duLieuXML.id = this.duLieuXmlId;
        duLieuXML.nam = this.nam;
        duLieuXML.thang = this.thang;
        duLieuXML.trangThai = TRANG_THAI_DU_LIEU_XML.DA_UPLOAD;
        duLieuXML.duongDan = this.filePath;
        duLieuXML.soFile = this.dataReadXML.length;
        duLieuXML.soHopLe = this.dataReadXML.filter(x => x.trangThaiImport === 1).length;
        duLieuXML.soHopLeCu = this.dataReadXML.filter(x => x.trangThaiImport === 1 && x.id > 0).length;
        duLieuXML.soKhongHopLe = this.dataReadXML.filter(x => x.trangThaiImport === 0).length;
        duLieuXML.jsonKhongHopLe = JSON.stringify(this.dataReadXML.filter(x => x.trangThaiImport === 0));
        duLieuXML.soLoiCauTruc = this.listFileError.length;
        duLieuXML.jsonLoiCauTruc = JSON.stringify(this.listFileError);
        let input = new UploadXMLCaBenhRequest();
        input.listCaBenh = this.listCaBenh;
        input.duLieuXML = duLieuXML;
        this._dataService.uploadXMLCaBenh(input).subscribe((result) => {
            if (result.isSuccessful) {
                this.notify.info('Đã upload và đồng bộ dữ liệu lên hệ thống thành công!!');
                //this.success(true);
                this.saving = false;
                this.backListEvent.emit(false);
            } else {
                this.notify.error(result.errorMessage);
                this.saving = false;
            }
        });
    }

    handleChange(info: any): void {
        if (info.type === 'success') {
            this.dataReadXML = info.file.response.result.listCaBenh;
            if (this.dataReadXML !== null && this.dataReadXML !== undefined) {
                this.dataReadXML.forEach(item => {
                    let caBenh = new CaBenhImportDto();
                    caBenh.alT_ChiSo = item.alT_ChiSo;
                    caBenh.antiHBcIgG_KetQua = item.antiHBcIgG_KetQua;
                    caBenh.antiHBcIgM_KetQua = item.antiHBcIgM_KetQua;
                    caBenh.antiHBe_KetQua = item.antiHBe_KetQua;
                    caBenh.antiHBs_KetQua = item.antiHBs_KetQua;
                    caBenh.antiHCV_KetQua = item.antiHCV_KetQua;
                    caBenh.antiHCV_NgayLam = item.antiHCV_NgayLam;
                    caBenh.asT_ChiSo = item.asT_ChiSo;
                    caBenh.chanDoanViemGanB = item.chanDoanViemGanB;
                    caBenh.chanDoanViemGanC = item.chanDoanViemGanC;
                    caBenh.coSo_MaTinh = item.coSo_MaTinh;
                    caBenh.diaChi = item.diaChi;
                    caBenh.dienThoai = item.dienThoai;
                    caBenh.donViCoSoId = item.donViCoSoId;
                    caBenh.duLieuXMLId = item.duLieuXMLId;
                    caBenh.gioiTinh = item.gioiTinh;
                    caBenh.hBeAb_KetQua = item.hBeAb_KetQua;
                    caBenh.hBeAg_KetQua = item.hBeAg_KetQua;
                    caBenh.hBsAg_KetQua = item.hBsAg_KetQua;
                    caBenh.hBsAg_NgayLam = item.hBsAg_NgayLam;
                    caBenh.hbvdnA_ChiSo = item.hbvdnA_ChiSo;
                    caBenh.hbvdnA_DonVi = item.hbvdnA_DonVi;
                    caBenh.hbvdnA_LanCuoi_NgayLam = item.hbvdnA_LanCuoi_NgayLam;
                    caBenh.hbvdnA_LanCuoi_Nguong = item.hbvdnA_LanCuoi_Nguong;
                    caBenh.hbvdnA_NgayLam = item.hbvdnA_NgayLam;
                    caBenh.hbvdnA_Nguong = item.hbvdnA_Nguong;
                    caBenh.hcVcAg_KetQua = item.hcVcAg_KetQua;
                    caBenh.hcvGenotype_ChiSo = item.hcvGenotype_ChiSo;
                    caBenh.hcvGenotype_KieuGen = item.hcvGenotype_KieuGen;
                    caBenh.hcvGenotype_LanCuoi_NgayLam = item.hcvGenotype_LanCuoi_NgayLam;
                    caBenh.hcvGenotype_LanCuoi_Nguong = item.hcvGenotype_LanCuoi_Nguong;
                    caBenh.hcvGenotype_NgayLam = item.hcvGenotype_NgayLam;
                    caBenh.hcvGenotype_Nguong = item.hcvGenotype_Nguong;
                    caBenh.hcvarN_ChiSo = item.hcvarN_ChiSo;
                    caBenh.hcvarN_DonVi = item.hcvarN_DonVi;
                    caBenh.hcvarN_LanCuoi_NgayLam = item.hcvarN_LanCuoi_NgayLam;
                    caBenh.hcvarN_LanCuoi_Nguong = item.hcvarN_LanCuoi_Nguong;
                    caBenh.hcvarN_NgayLam = item.hcvarN_NgayLam;
                    caBenh.hcvarN_Nguong = item.hcvarN_Nguong;
                    caBenh.hoTen = item.hoTen;
                    caBenh.id = item.id;
                    caBenh.ketQuaDieuTri_ViemGanB = item.ketQuaDieuTri_ViemGanB;
                    caBenh.ketQuaDieuTri_ViemGanC = item.ketQuaDieuTri_ViemGanC;
                    caBenh.level = item.level;
                    caBenh.listError = item.listError;
                    caBenh.maBN = item.maBN;
                    caBenh.maHuyen = item.maHuyen;
                    caBenh.maTinh = item.maTinh;
                    caBenh.maXa = item.maXa;
                    caBenh.namSinh = item.namSinh;
                    caBenh.ngayBatDau_ViemGanB = item.ngayBatDau_ViemGanB;
                    caBenh.ngayBatDau_ViemGanC = item.ngayBatDau_ViemGanC;
                    caBenh.ngayKetThuc_ViemGanB = item.ngayKetThuc_ViemGanB;
                    caBenh.ngayKetThuc_ViemGanC = item.ngayKetThuc_ViemGanC;
                    caBenh.ngayTuVong = item.ngayTuVong;
                    caBenh.nhiemHIV = item.nhiemHIV;
                    caBenh.plT_ChiSo = item.plT_ChiSo;
                    caBenh.plT_DonVi = item.plT_DonVi;
                    caBenh.soBHYT = item.soBHYT;
                    caBenh.soCMND = item.soCMND;
                    caBenh.soLanDieuTri_ViemGanB = item.soLanDieuTri_ViemGanB;
                    caBenh.soLanDieuTri_ViemGanC = item.soLanDieuTri_ViemGanC;
                    caBenh.tenCoSo = item.tenCoSo;
                    caBenh.tenHuyen = item.tenHuyen;
                    caBenh.tenTinh = item.tenTinh;
                    caBenh.tenXa = item.tenXa;
                    caBenh.trangThaiImport = item.trangThaiImport;
                    caBenh.tuVong = item.tuVong;
                    caBenh.tuoi = item.tuoi;
                    caBenh.viemGanBMan = item.viemGanBMan;
                    caBenh.viemGanCMan = item.viemGanCMan;
                    caBenh.viemGanD = item.viemGanD;
                    caBenh.fileName = item.fileName;
                    caBenh.ketQuaDieuTri = item.ketQuaDieuTri;
                    caBenh.maLoaiKCB = item.maLoaiKCB;
                    caBenh.coDungThuocViemGanB = item.coDungThuocViemGanB;
                    caBenh.thuocViemGanB = item.thuocViemGanB;
                    caBenh.coDungThuocViemGanC = item.coDungThuocViemGanC;
                    caBenh.thuocViemGanC = item.thuocViemGanC;
                    caBenh.maBenh = item.maBenh;
                    caBenh.dichVu = item.dichVu;

                    if (item.listDieuTriViemGanB !== null && item.listDieuTriViemGanB !== undefined) {
                        let listDieuTriViemGanB = _.cloneDeep(item.listDieuTriViemGanB);
                        caBenh.listDieuTriViemGanB = [];
                        listDieuTriViemGanB.forEach(dieuTriVGB => {
                            let dieuTri = new CaBenh_DieuTriDto();
                            dieuTri.id = dieuTriVGB.id;
                            dieuTri.caBenhId = dieuTriVGB.caBenhId;
                            dieuTri.nhomBenh = dieuTriVGB.nhomBenh;
                            dieuTri.ngayBatDau = dieuTriVGB.ngayBatDau;
                            dieuTri.ngayKetThuc = dieuTriVGB.ngayKetThuc;
                            dieuTri.thuocSuDung = dieuTriVGB.thuocSuDung;
                            dieuTri.jsonThuocSuDung = dieuTriVGB.jsonThuocSuDung;
                            dieuTri.thuocDieuTri = dieuTriVGB.thuocDieuTri;
                            dieuTri.ketQuaDieuTri = dieuTriVGB.ketQuaDieuTri;
                            dieuTri.ghiChu = dieuTriVGB.ghiChu;
                            dieuTri.soNgayDieuTri = dieuTriVGB.soNgayDieuTri;
                            dieuTri.maLoaiKCB = dieuTriVGB.maLoaiKCB;
                            dieuTri.ketQuaDieuTriXML = dieuTriVGB.ketQuaDieuTriXML;
                            dieuTri.coDungThuoc = dieuTriVGB.coDungThuoc;
                            dieuTri.thuocSuDungXML = dieuTriVGB.thuocSuDungXML;
                            if (dieuTriVGB.listXetNghiem !== null && dieuTriVGB.listXetNghiem !== undefined) {
                                dieuTri.listXetNghiem = [];
                                let listXetNghiem = _.cloneDeep(dieuTriVGB.listXetNghiem);
                                listXetNghiem.forEach(xetNghiemVGC => {
                                    let xetNghiem = new CaBenh_XetNghiemDto();
                                    xetNghiem.caBenhId = xetNghiemVGC.caBenhId;
                                    xetNghiem.caBenh_DieuTriId = xetNghiemVGC.caBenh_DieuTriId;
                                    xetNghiem.tenXetNghiem = xetNghiemVGC.tenXetNghiem;
                                    xetNghiem.nhomXetNghiem = xetNghiemVGC.nhomXetNghiem;
                                    xetNghiem.ngayLam = xetNghiemVGC.ngayLam;
                                    xetNghiem.chiSo = xetNghiemVGC.chiSo;
                                    xetNghiem.nguong = xetNghiemVGC.nguong;
                                    xetNghiem.donVi = xetNghiemVGC.donVi;
                                    dieuTri.listXetNghiem.push(xetNghiem);
                                });
                            }
                            caBenh.listDieuTriViemGanB.push(dieuTri);
                        });
                    }
                    if (item.listDieuTriViemGanC !== null && item.listDieuTriViemGanC !== undefined) {
                        caBenh.listDieuTriViemGanC = [];
                        let listDieuTriViemGanC = _.cloneDeep(item.listDieuTriViemGanC);
                        listDieuTriViemGanC.forEach(itemDieuTri => {
                            let dieuTri = new CaBenh_DieuTriDto();
                            dieuTri.id = itemDieuTri.id;
                            dieuTri.caBenhId = itemDieuTri.caBenhId;
                            dieuTri.nhomBenh = itemDieuTri.nhomBenh;
                            dieuTri.ngayBatDau = itemDieuTri.ngayBatDau;
                            dieuTri.ngayKetThuc = itemDieuTri.ngayKetThuc;
                            dieuTri.thuocSuDung = itemDieuTri.thuocSuDung;
                            dieuTri.jsonThuocSuDung = itemDieuTri.jsonThuocSuDung;
                            dieuTri.thuocDieuTri = itemDieuTri.thuocDieuTri;
                            dieuTri.ketQuaDieuTri = itemDieuTri.ketQuaDieuTri;
                            dieuTri.ghiChu = itemDieuTri.ghiChu;
                            dieuTri.soNgayDieuTri = itemDieuTri.soNgayDieuTri;
                            dieuTri.maLoaiKCB = itemDieuTri.maLoaiKCB;
                            dieuTri.ketQuaDieuTriXML = itemDieuTri.ketQuaDieuTriXML;
                            dieuTri.coDungThuoc = itemDieuTri.coDungThuoc;
                            dieuTri.thuocSuDungXML = itemDieuTri.thuocSuDungXML;
                            if (itemDieuTri.listXetNghiem !== null && itemDieuTri.listXetNghiem !== undefined) {
                                dieuTri.listXetNghiem = [];
                                let listXetNghiem = _.cloneDeep(itemDieuTri.listXetNghiem);
                                listXetNghiem.forEach(itemXetNghiem => {
                                    let xetNghiem = new CaBenh_XetNghiemDto();
                                    xetNghiem.caBenhId = itemXetNghiem.caBenhId;
                                    xetNghiem.caBenh_DieuTriId = itemXetNghiem.caBenh_DieuTriId;
                                    xetNghiem.tenXetNghiem = itemXetNghiem.tenXetNghiem;
                                    xetNghiem.nhomXetNghiem = itemXetNghiem.nhomXetNghiem;
                                    xetNghiem.ngayLam = itemXetNghiem.ngayLam;
                                    xetNghiem.chiSo = itemXetNghiem.chiSo;
                                    xetNghiem.nguong = itemXetNghiem.nguong;
                                    xetNghiem.donVi = itemXetNghiem.donVi;
                                    dieuTri.listXetNghiem.push(xetNghiem);
                                });
                            }
                            caBenh.listDieuTriViemGanC.push(dieuTri);
                        });
                    }
                    this.listCaBenh.push(caBenh);
                });
                this.filePath = info.file.response.result.filePath;
                this.dataHopLe = this.dataReadXML.filter(x => x.trangThaiImport === 1);
                this.dataKhongHopLe = this.dataReadXML.filter(x => x.trangThaiImport === 0);
                this.listFileError = info.file.response.result.listFileError;
            } else {
                this.error = info.file.response.result;
            }
        }
    }
}
