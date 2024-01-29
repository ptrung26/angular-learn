import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import {
    BAO_HIEM_Y_TE,
    DashboardDto,
    DashboardOutputDto,
    DashboardServiceProxy,
    DashboardTongHopRequest,
    GIOI_TINH,
    KET_QUA_XET_NGHIEM,
    NHOM_NGUONG,
    USER_LEVEL,
} from '@shared/service-proxies/service-proxies';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { finalize } from '@node_modules/rxjs/internal/operators';

@Component({
    selector: 'vgc-bo-y-te',
    templateUrl: './vgc-bo-y-te.component.html',
    encapsulation: ViewEncapsulation.Emulated,
})
export class VgcBoYTeComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() maTinh: string;
    @Input() donViCoSoId: number;
    @Input() baoHiemYTe: number;
    @Input() nhomBenh: number;
    @Input() tuNgay: string;
    @Input() denNgay: string;
    userLevel = USER_LEVEL;
    nhomNguong = NHOM_NGUONG;
    gioiTinh = GIOI_TINH;
    //Số liệu hiển thị ra dashboard
    dataTongHopBHYT: DashboardDto[] = [];
    dataTongHop: DashboardDto[] = []; //Lọc theo BHYT
    tongSangLoc = 0;
    sangLocDuongTinh = 0;
    sangLocDuongTinhPercent = 0;
    dongNhiemCHIV = '';
    dongNhiemBC = '';
    tuVong = 0;
    xetNghiem_ChanDoan = 0;
    nhiemMan_ChanDoan = 0;
    xetNghiem_DieuTri = 0;
    dieuTri_KhoiBenh = 0;
    groupByTinh = [];
    groupByTinhSort = [];
    groupByTinhSortDesc = [];
    dieuTriBHYT = 0;
    VGC_XetNghiemKhangDinh = 0;
    VGC_XetNghiemKhangDinhChuanDoan = 0;
    result: DashboardOutputDto;

    vgcscreeningtestlabel = [];
    vgcscreeningtestpositivelable = [];
    indexTab = 0;

    constructor(
        injector: Injector,
        private _dataService: DashboardServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadData();
    }

    loadData(): void {
        abp.ui.setBusy();
        this.tongSangLoc = 0;
        this.sangLocDuongTinh = 0;
        this.sangLocDuongTinhPercent = 0;
        this.dongNhiemCHIV = '';
        this.dongNhiemBC = '';
        this.tuVong = 0;
        this.xetNghiem_ChanDoan = 0;
        this.nhiemMan_ChanDoan = 0;
        this.xetNghiem_DieuTri = 0;
        this.dieuTri_KhoiBenh = 0;
        this.groupByTinh = [];
        this.groupByTinhSort = [];
        this.groupByTinhSortDesc = [];
        this.dieuTriBHYT = 0;
        this.VGC_XetNghiemKhangDinh = 0;
        this.VGC_XetNghiemKhangDinhChuanDoan = 0;
        this.vgcscreeningtestlabel = ['0', '0', '0', '0'];
        this.vgcscreeningtestpositivelable = ['0', '0', '0', '0'];

        let tongHopRequest = new DashboardTongHopRequest();
        tongHopRequest.maTinh = this.maTinh;
        tongHopRequest.donViCoSoId = this.donViCoSoId;
        tongHopRequest.nhomBenh = this.nhomBenh;
        tongHopRequest.tuNgay = this.tuNgay;
        tongHopRequest.denNgay = this.denNgay;
        this.groupByTinh = [];
        this.groupByTinhSort = [];
        this.groupByTinhSortDesc = [];

        this._dataService.dashboardTongHop(tongHopRequest)
            .pipe(finalize(() => {
                abp.ui.clearBusy();
            }))
            .subscribe(result => {
                this.result = _.cloneDeep(result);
                this.dataTongHopBHYT = result.listData;
                this.dataTongHop = result.listData;
                this.dongNhiemBC = result.dongNhiemBC;
                if (this.baoHiemYTe === BAO_HIEM_Y_TE.BHYT_CO || this.baoHiemYTe === BAO_HIEM_Y_TE.BHYT_KHONG) {
                    this.dataTongHop = result.listData.filter(x => x.bhyt === this.baoHiemYTe);
                }

                this.tongSangLoc = this.dataTongHop.length;
                this.sangLocDuongTinh = this.dataTongHop.filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcVcAg_KetQua !== KET_QUA_XET_NGHIEM.KHONG_XN || x.hcvarN_NgayLam || x.hcvGenotype_NgayLam).length;
                if (this.dataTongHop.length > 0) {
                    this.sangLocDuongTinhPercent = this.sangLocDuongTinh * 100 / this.dataTongHop.length;
                }
                this.xetNghiem_ChanDoan = this.dataTongHop.filter(x => x.hcvarN_NgayLam !== null && x.hcvarN_NgayLam !== undefined).length; //Có giá trị nghĩa là có làm
                this.nhiemMan_ChanDoan = this.dataTongHop.filter(x => x.viemGanCMan === true && x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length;
                this.xetNghiem_DieuTri = this.dataTongHop.filter(x => x.hcvarN_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG).length;
                // this.dieuTri_KhoiBenh = dataTongHop.filter(x => x.viemGanCMan === true && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.hcvarN_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG && x.soNgayDieuTriViemGanC > 83).length;
                this.dieuTri_KhoiBenh = this.dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG) && (x.ketQuaDieuTri === 1 || x.ketQuaDieuTri === 2)).length;
                this.dongNhiemCHIV = result.dongNhiemCHIV;
                this.tuVong = this.dataTongHop.filter(x => x.viemGanCMan && x.coDungThuocViemGanC && x.tuVong === true).length;
                this.dieuTriBHYT = this.dataTongHopBHYT.filter(x => x.soLanDieuTri_ViemGanC > 0 && x.bhyt === BAO_HIEM_Y_TE.BHYT_CO).length;
                this.groupByTinh = this.groupByKey(_.cloneDeep(this.dataTongHop), 'coSo_TenTinh');
                (Object.keys(this.groupByTinh)).forEach(x => {
                    this.groupByTinhSort.push(
                        {
                            tenTinh: x,
                            soBenhNhan: this.groupByTinh[x].length,
                            soDuongTinh: this.groupByTinh[x].filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length,
                            soAmTinh: this.groupByTinh[x].filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.AM_TINH).length,
                            soNhiemMan: this.groupByTinh[x].filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG)).length,
                            soDieuTri: this.groupByTinh[x].filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG)).length,
                        },
                    );
                });
                this.groupByTinhSort = _.sortBy(this.groupByTinhSort, 'soBenhNhan');
                this.groupByTinhSortDesc = _.sortBy(_.cloneDeep(this.groupByTinhSort), ['tenTinh', 'soBenhNhan', 'soDuongTinh', 'soAmTinh', 'soNhiemMan', 'soDieuTri'], ['asc', 'desc', 'asc', 'asc', 'asc', 'asc']);

                let vgcscreeningtestNam = _.cloneDeep(this.dataTongHop).filter(x => x.gioiTinh === GIOI_TINH.NAM).length;
                let vgcscreeningtestNu = _.cloneDeep(this.dataTongHop).filter(x => x.gioiTinh === GIOI_TINH.NU).length;
                if (this.dataTongHop.length > 0) {
                    this.vgcscreeningtestlabel = [];
                    this.vgcscreeningtestlabel.push(vgcscreeningtestNam);
                    let vgcscreeningtestNamPercent = (vgcscreeningtestNam * 100 / this.dataTongHop.length).toFixed(1);
                    this.vgcscreeningtestlabel.push(vgcscreeningtestNamPercent);
                    this.vgcscreeningtestlabel.push(vgcscreeningtestNu);
                    this.vgcscreeningtestlabel.push((100 - parseFloat(vgcscreeningtestNamPercent)).toFixed(1));
                }
                let dataScreeningPositive = _.cloneDeep(this.dataTongHop).filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcVcAg_KetQua !== KET_QUA_XET_NGHIEM.KHONG_XN || x.hcvarN_NgayLam || x.hcvGenotype_NgayLam);
                let vgcscreeningtestpositiveNam = dataScreeningPositive.filter(x => x.gioiTinh === GIOI_TINH.NAM).length;
                let vgcscreeningtestpositiveNu = dataScreeningPositive.filter(x => x.gioiTinh === GIOI_TINH.NU).length;
                if (this.dataTongHop.length > 0) {
                    this.vgcscreeningtestpositivelable = [];
                    this.vgcscreeningtestpositivelable.push(vgcscreeningtestpositiveNam);
                    let vgcscreeningtestpositiveNamPercent = (vgcscreeningtestpositiveNam * 100 / dataScreeningPositive.length).toFixed(1);
                    this.vgcscreeningtestpositivelable.push(vgcscreeningtestpositiveNamPercent);
                    this.vgcscreeningtestpositivelable.push(vgcscreeningtestpositiveNu);
                    this.vgcscreeningtestpositivelable.push((100 - parseFloat(vgcscreeningtestpositiveNamPercent)).toFixed(1));
                }
                this.VGC_XetNghiemKhangDinh = this.dataTongHop.filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua !== KET_QUA_XET_NGHIEM.KHONG_XN || x.hcvarN_NgayLam || x.hcvGenotype_NgayLam)).length;
                this.VGC_XetNghiemKhangDinhChuanDoan = this.dataTongHop.filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG)).length;


                this.getChart(this.dataTongHop, this.dataTongHopBHYT, this.groupByTinhSort, this.tongSangLoc, this.sangLocDuongTinh, this.VGC_XetNghiemKhangDinh, this.VGC_XetNghiemKhangDinhChuanDoan);
                abp.ui.clearBusy();
            });
    }

    groupByKey(data, key) {
        return data.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    getChart(dataTongHop, dataTongHopBHYT, groupByTinhSort, tongSangLoc, sangLocDuongTinh, VGC_XetNghiemKhangDinh, VGC_XetNghiemKhangDinhChuanDoan) {
        am4core.ready(function() {
            am4core.useTheme(am4themes_animated);

            //#region Số người xét nghiệm anti-HCV
            let chartScreeningTest = am4core.create('vgc-screening-test', am4charts.XYChart);
            chartScreeningTest.data = [
                {
                    'age': '50+ [bold](' + (dataTongHop.filter(x => x.tuoi > 49).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 49 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 49 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '45-49 [bold](' + (dataTongHop.filter(x => x.tuoi > 44 && x.tuoi < 50).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 44 && x.tuoi < 50 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 44 && x.tuoi < 50 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '40-44 [bold](' + (dataTongHop.filter(x => x.tuoi > 39 && x.tuoi < 45).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 39 && x.tuoi < 45 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 39 && x.tuoi < 45 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '35-39 [bold](' + (dataTongHop.filter(x => x.tuoi > 34 && x.tuoi < 40).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 34 && x.tuoi < 40 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 34 && x.tuoi < 40 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '30-34 [bold](' + (dataTongHop.filter(x => x.tuoi > 29 && x.tuoi < 35).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 29 && x.tuoi < 35 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 29 && x.tuoi < 35 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '25-29 [bold](' + (dataTongHop.filter(x => x.tuoi > 24 && x.tuoi < 30).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 24 && x.tuoi < 30 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 24 && x.tuoi < 30 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '20-24 [bold](' + (dataTongHop.filter(x => x.tuoi > 19 && x.tuoi < 25).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 19 && x.tuoi < 25 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 19 && x.tuoi < 25 && x.gioiTinh === GIOI_TINH.NU).length,
                }, {
                    'age': '15-19 [bold](' + (dataTongHop.filter(x => x.tuoi > 14 && x.tuoi < 20).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi > 14 && x.tuoi < 20 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi > 14 && x.tuoi < 20 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '<15 [bold](' + (dataTongHop.filter(x => x.tuoi < 15).length) + ')[/]',
                    'male': (dataTongHop.filter(x => x.tuoi < 15 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataTongHop.filter(x => x.tuoi < 15 && x.gioiTinh === GIOI_TINH.NU).length,
                }];
            chartScreeningTest.numberFormatter.numberFormat = '#.#s';
            let categoryTestAxis = chartScreeningTest.yAxes.push(new am4charts.CategoryAxis());
            categoryTestAxis.dataFields.category = 'age';
            categoryTestAxis.renderer.grid.template.location = 0;
            categoryTestAxis.renderer.inversed = true;

            let valueTestAxis = chartScreeningTest.xAxes.push(new am4charts.ValueAxis());
            valueTestAxis.calculateTotals = true;
            valueTestAxis.extraMin = 0.1;
            valueTestAxis.extraMax = 0.1;
            valueTestAxis.renderer.minGridDistance = 20;
            valueTestAxis.renderer.ticks.template.length = 5;
            valueTestAxis.renderer.ticks.template.disabled = false;
            valueTestAxis.renderer.ticks.template.strokeOpacity = 0.4;

            let maleTest = chartScreeningTest.series.push(new am4charts.ColumnSeries());
            maleTest.calculatePercent = true;
            maleTest.dataFields.valueX = 'male';
            maleTest.dataFields.categoryY = 'age';
            maleTest.clustered = false;
            maleTest.columns.template.fill = am4core.color('#5491CD');
            maleTest.columns.template.strokeOpacity = 0;

            let maleTestLabel = maleTest.bullets.push(new am4charts.LabelBullet());
            maleTestLabel.label.text = '[bold]{valueX}[/]\n[font-size: 12px]({valueX.percent}%)[/]';
            maleTestLabel.label.hideOversized = false;
            maleTestLabel.label.truncate = false;
            maleTestLabel.label.horizontalCenter = 'right';
            maleTestLabel.label.dx = 0;

            let femaleTest = chartScreeningTest.series.push(new am4charts.ColumnSeries());
            femaleTest.calculatePercent = true;
            femaleTest.dataFields.valueX = 'female';
            femaleTest.dataFields.categoryY = 'age';
            femaleTest.clustered = false;
            femaleTest.columns.template.fill = am4core.color('#FFC2BC');
            femaleTest.columns.template.strokeOpacity = 0;

            let femaleTestLabel = femaleTest.bullets.push(new am4charts.LabelBullet());
            femaleTestLabel.label.text = '[bold]{valueX}[/]\n[font-size: 12px]({valueX.percent}%)[/]';
            femaleTestLabel.label.hideOversized = false;
            femaleTestLabel.label.truncate = false;
            femaleTestLabel.label.horizontalCenter = 'left';
            femaleTestLabel.label.dx = 0;
            //#endregion

            //#region Số người xét nghiệm anti-HCV dương tính
            let dataScreeningPositive = _.cloneDeep(dataTongHop).filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcVcAg_KetQua !== KET_QUA_XET_NGHIEM.KHONG_XN || x.hcvarN_NgayLam || x.hcvGenotype_NgayLam);
            let chartScreeningPositive = am4core.create('vgc-screening-test-positive', am4charts.XYChart);
            chartScreeningPositive.data = [
                {
                    'age': '50+ [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 49).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 49 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 49 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '45-49 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 44 && x.tuoi < 50).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 44 && x.tuoi < 50 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 44 && x.tuoi < 50 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '40-44 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 39 && x.tuoi < 45).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 39 && x.tuoi < 45 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 39 && x.tuoi < 45 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '35-39 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 34 && x.tuoi < 40).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 34 && x.tuoi < 40 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 34 && x.tuoi < 40 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '30-34 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 29 && x.tuoi < 35).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 29 && x.tuoi < 35 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 29 && x.tuoi < 35 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '25-29 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 24 && x.tuoi < 30).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 24 && x.tuoi < 30 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 24 && x.tuoi < 30 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '20-24 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 19 && x.tuoi < 25).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 19 && x.tuoi < 25 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 19 && x.tuoi < 25 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '15-19 [bold](' + (dataScreeningPositive.filter(x => x.tuoi > 14 && x.tuoi < 20).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi > 14 && x.tuoi < 20 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi > 14 && x.tuoi < 20 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '<15 [bold](' + (dataScreeningPositive.filter(x => x.tuoi < 15).length) + ')[/]',
                    'male': (dataScreeningPositive.filter(x => x.tuoi < 15 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': dataScreeningPositive.filter(x => x.tuoi < 15 && x.gioiTinh === GIOI_TINH.NU).length,
                }];

            chartScreeningPositive.numberFormatter.numberFormat = '#.#s';
            let categoryPositiveAxis = chartScreeningPositive.yAxes.push(new am4charts.CategoryAxis());
            categoryPositiveAxis.dataFields.category = 'age';
            categoryPositiveAxis.renderer.grid.template.location = 0;
            categoryPositiveAxis.renderer.inversed = true;

            let valuePositiveAxis = chartScreeningPositive.xAxes.push(new am4charts.ValueAxis());
            valuePositiveAxis.calculateTotals = true;
            valuePositiveAxis.extraMin = 0.1;
            valuePositiveAxis.extraMax = 0.1;
            valuePositiveAxis.renderer.minGridDistance = 40;
            valuePositiveAxis.renderer.ticks.template.length = 5;
            valuePositiveAxis.renderer.ticks.template.disabled = false;
            valuePositiveAxis.renderer.ticks.template.strokeOpacity = 0.4;
            valuePositiveAxis.renderer.labels.template.adapter.add('text', function(text) {
                return text === 'Male' || text === 'Female' ? text : text + '';
            });
            let malePositive = chartScreeningPositive.series.push(new am4charts.ColumnSeries());
            malePositive.dataFields.valueX = 'male';
            malePositive.dataFields.categoryY = 'age';
            malePositive.clustered = false;
            malePositive.calculatePercent = true;
            malePositive.columns.template.fill = am4core.color('#5491CD');
            malePositive.columns.template.strokeOpacity = 0;

            let malePositiveLabel = malePositive.bullets.push(new am4charts.LabelBullet());
            malePositiveLabel.label.text = '[bold]{valueX}[/]\n[font-size: 12px]({valueX.percent}%)[/]';
            malePositiveLabel.label.hideOversized = false;
            malePositiveLabel.label.truncate = false;
            malePositiveLabel.label.horizontalCenter = 'right';
            malePositiveLabel.label.dx = 0;

            let femalePositive = chartScreeningPositive.series.push(new am4charts.ColumnSeries());
            femalePositive.dataFields.valueX = 'female';
            femalePositive.dataFields.categoryY = 'age';
            femalePositive.clustered = false;
            femalePositive.calculatePercent = true;
            femalePositive.columns.template.fill = am4core.color('#FFC2BC');
            femalePositive.columns.template.strokeOpacity = 0;

            let femalePositiveLabel = femalePositive.bullets.push(new am4charts.LabelBullet());
            femalePositiveLabel.label.text = '[bold]{valueX}[/]\n[font-size: 12px]({valueX.percent}%)[/]';
            femalePositiveLabel.label.hideOversized = false;
            femalePositiveLabel.label.truncate = false;
            femalePositiveLabel.label.horizontalCenter = 'left';
            femalePositiveLabel.label.dx = 0;
            //#endregion

            //#region 10 địa phương có xét nghiệm anti-HCV cao nhất
            let topTinhData = [];
            let countTop = 0;
            for (let i = groupByTinhSort.length - 1; i > -1; i--) {
                if (countTop < 10) {
                    topTinhData.push({
                        'city': groupByTinhSort[i]['tenTinh'],
                        'value': groupByTinhSort[i]['soBenhNhan'],
                    });
                }
                countTop = countTop + 1;
            }
            let chartTopCity = am4core.create('vgc-chart-top-city', am4charts.XYChart);
            chartTopCity.padding(10, 40, 10, 40);

            let topcityCategoryAxis = chartTopCity.yAxes.push(new am4charts.CategoryAxis());
            topcityCategoryAxis.renderer.grid.template.location = 0;
            topcityCategoryAxis.dataFields.category = 'city';
            topcityCategoryAxis.renderer.minGridDistance = 1;
            topcityCategoryAxis.renderer.inversed = true; //Sắp xếp theo height - low
            topcityCategoryAxis.renderer.grid.template.disabled = true;


            let topcityValueTopAxis = chartTopCity.xAxes.push(new am4charts.ValueAxis());
            topcityValueTopAxis.min = 0;

            let topcityseries = chartTopCity.series.push(new am4charts.ColumnSeries());
            topcityseries.dataFields.categoryY = 'city';
            topcityseries.dataFields.valueX = 'value';
            topcityseries.tooltipText = '{valueX.value}';
            topcityseries.columns.template.strokeOpacity = 0;
            topcityseries.columns.template.column.cornerRadiusBottomRight = 0;
            topcityseries.columns.template.column.cornerRadiusTopRight = 0;
            topcityseries.columns.template.height = 20;

            let topcityLabelBullet = topcityseries.bullets.push(new am4charts.LabelBullet());
            topcityLabelBullet.label.horizontalCenter = 'left';
            topcityLabelBullet.label.dx = 10;
            topcityLabelBullet.label.text = '{values.valueX.workingValue}';
            topcityLabelBullet.locationX = 0;
            topcityLabelBullet.locationY = 0.5;
            topcityLabelBullet.fontSize = 12;
            topcityseries.columns.template.adapter.add('fill', function(fill, target) {
                return chartTopCity.colors.getIndex(target.dataItem.index);
            });

            topcityCategoryAxis.sortBySeries = topcityseries;
            chartTopCity.data = topTinhData;
            //#endregion

            //#region Số người có anti-HCV dương tính được xét nghiệm khẳng định viêm gan C (HCV RNA/HCVcAg)
            let chartSexTest = am4core.create('vgc-chart-sex-cag-test', am4charts.PieChart);
            let cagTestData = dataTongHop.filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua !== KET_QUA_XET_NGHIEM.KHONG_XN || x.hcvarN_NgayLam || x.hcvGenotype_NgayLam));

            chartSexTest.innerRadius = am4core.percent(30);
            chartSexTest.data = [
                {
                    'sex': 'Nam',
                    'value': cagTestData.filter(x => x.gioiTinh === GIOI_TINH.NAM).length,
                    'color': am4core.color('#16C8BE'),
                },
                {
                    'sex': 'Nữ',
                    'value': cagTestData.filter(x => x.gioiTinh === GIOI_TINH.NU).length,
                    'color': am4core.color('#F2C94C'),
                },
            ];
            let sextestseries = chartSexTest.series.push(new am4charts.PieSeries());
            sextestseries.dataFields.value = 'value';
            sextestseries.dataFields.category = 'sex';
            sextestseries.slices.template.stroke = am4core.color('#fff');
            sextestseries.slices.template.strokeOpacity = 1;
            sextestseries.hiddenState.properties.opacity = 1;
            sextestseries.hiddenState.properties.endAngle = -90;
            sextestseries.hiddenState.properties.startAngle = -90;
            sextestseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            sextestseries.slices.template.propertyFields.fill = 'color';
            chartSexTest.hiddenState.properties.radius = am4core.percent(0);
            sextestseries.ticks.template.disabled = true;
            sextestseries.alignLabels = false;
            sextestseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            sextestseries.labels.template.radius = am4core.percent(-30);
            sextestseries.labels.template.fill = am4core.color('white');
            chartSexTest.legend = new am4charts.Legend();
            sextestseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartSexTest.hiddenState.properties.radius = am4core.percent(0);
            chartSexTest.legend.markers.template.width = 12;
            chartSexTest.legend.markers.template.height = 12;
            const markerSexTest: any = chartSexTest.legend.markers.template.children.getIndex(0);
            markerSexTest.cornerRadius(6, 6, 6, 6);

            let chartOldTest = am4core.create('vgc-chart-old-cag-test', am4charts.XYChart);
            chartOldTest.data = [{
                'old': '<15',
                'value': cagTestData.filter(x => x.tuoi < 15).length,
            }, {
                'old': '15-19',
                'value': cagTestData.filter(x => x.tuoi > 14 && x.tuoi < 20).length,
            }, {
                'old': '20-24',
                'value': cagTestData.filter(x => x.tuoi > 19 && x.tuoi < 25).length,
            }, {
                'old': '25-29',
                'value': cagTestData.filter(x => x.tuoi > 24 && x.tuoi < 30).length,
            }, {
                'old': '30-34',
                'value': cagTestData.filter(x => x.tuoi > 29 && x.tuoi < 35).length,
            }, {
                'old': '35-39',
                'value': cagTestData.filter(x => x.tuoi > 34 && x.tuoi < 40).length,
            }, {
                'old': '40-44',
                'value': cagTestData.filter(x => x.tuoi > 39 && x.tuoi < 45).length,
            }, {
                'old': '45-49',
                'value': cagTestData.filter(x => x.tuoi > 44 && x.tuoi < 50).length,
            }, {
                'old': '50+',
                'value': cagTestData.filter(x => x.tuoi > 49).length,
            }];
            let oldtestCategoryAxis = chartOldTest.xAxes.push(new am4charts.CategoryAxis());
            oldtestCategoryAxis.dataFields.category = 'old';
            oldtestCategoryAxis.renderer.grid.template.location = 0;
            oldtestCategoryAxis.renderer.grid.template.strokeWidth = 0;
            oldtestCategoryAxis.renderer.minGridDistance = 30;
            oldtestCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
                // tslint:disable-next-line:no-bitwise
                // if (target.dataItem && target.dataItem.index && 2= = =2) {
                // return dy + 25;
                // }
                return dy;
            });
            let oldtestValueAxis = chartOldTest.yAxes.push(new am4charts.ValueAxis());
            oldtestValueAxis.extraMax = 0.1;
            oldtestValueAxis.numberFormatter = new am4core.NumberFormatter();
            oldtestValueAxis.numberFormatter.numberFormat = '#.';
            let oldtestseries = chartOldTest.series.push(new am4charts.ColumnSeries());
            oldtestseries.dataFields.valueY = 'value';
            oldtestseries.dataFields.categoryX = 'old';
            oldtestseries.name = 'Tuổi';
            // oldtestseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            oldtestseries.columns.template.fillOpacity = 1;
            oldtestseries.columns.template.fill = am4core.color('#4EC4FF');
            oldtestseries.columns.template.width = 28;
            oldtestseries.calculatePercent = true;
            let oldtestBullet = oldtestseries.bullets.push(new am4charts.LabelBullet());
            oldtestBullet.label.verticalCenter = 'bottom';
            oldtestBullet.label.dy = 0;
            oldtestBullet.label.wrap = false;
            oldtestBullet.label.truncate = false;
            oldtestBullet.label.text = '[bold]{values.valueY.workingValue}[/] ({valueY.percent.formatNumber(\'#.0\')}%)';
            //#endregion

            //#region Số người được xét nghiệm khẳng định viêm gan C và được chẩn đoán viêm gan C
            let chartSexPositive = am4core.create('vgc-chart-sex-cag-positive', am4charts.PieChart);
            let cagPositiveData = dataTongHop.filter(x => x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG));

            chartSexPositive.innerRadius = am4core.percent(30);
            chartSexPositive.data = [
                {
                    'sex': 'Nam',
                    'value': cagPositiveData.filter(x => x.gioiTinh === GIOI_TINH.NAM).length,
                    'color': am4core.color('#16C8BE'),
                },
                {
                    'sex': 'Nữ',
                    'value': cagPositiveData.filter(x => x.gioiTinh === GIOI_TINH.NU).length,
                    'color': am4core.color('#F2C94C'),
                },
            ];
            let sexpositiveseries = chartSexPositive.series.push(new am4charts.PieSeries());
            sexpositiveseries.dataFields.value = 'value';
            sexpositiveseries.dataFields.category = 'sex';
            sexpositiveseries.slices.template.stroke = am4core.color('#fff');
            sexpositiveseries.slices.template.strokeOpacity = 1;
            sexpositiveseries.hiddenState.properties.opacity = 1;
            sexpositiveseries.hiddenState.properties.endAngle = -90;
            sexpositiveseries.hiddenState.properties.startAngle = -90;
            sexpositiveseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            sexpositiveseries.slices.template.propertyFields.fill = 'color';
            chartSexPositive.hiddenState.properties.radius = am4core.percent(0);
            sexpositiveseries.ticks.template.disabled = true;
            sexpositiveseries.alignLabels = false;
            sexpositiveseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            sexpositiveseries.labels.template.radius = am4core.percent(-30);
            sexpositiveseries.labels.template.fill = am4core.color('white');
            chartSexPositive.legend = new am4charts.Legend();
            sexpositiveseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartSexPositive.hiddenState.properties.radius = am4core.percent(0);
            chartSexPositive.legend.markers.template.width = 12;
            chartSexPositive.legend.markers.template.height = 12;
            const markerSexPositive: any = chartSexPositive.legend.markers.template.children.getIndex(0);
            markerSexPositive.cornerRadius(6, 6, 6, 6);

            let chartOldPositive = am4core.create('vgc-chart-old-cag-positive', am4charts.XYChart);
            chartOldPositive.data = [{
                'old': '<15',
                'value': cagPositiveData.filter(x => x.tuoi < 15).length,
            }, {
                'old': '15-19',
                'value': cagPositiveData.filter(x => x.tuoi > 14 && x.tuoi < 20).length,
            }, {
                'old': '20-24',
                'value': cagPositiveData.filter(x => x.tuoi > 19 && x.tuoi < 25).length,
            }, {
                'old': '25-29',
                'value': cagPositiveData.filter(x => x.tuoi > 24 && x.tuoi < 30).length,
            }, {
                'old': '30-34',
                'value': cagPositiveData.filter(x => x.tuoi > 29 && x.tuoi < 35).length,
            }, {
                'old': '35-39',
                'value': cagPositiveData.filter(x => x.tuoi > 34 && x.tuoi < 40).length,
            }, {
                'old': '40-44',
                'value': cagPositiveData.filter(x => x.tuoi > 39 && x.tuoi < 45).length,
            }, {
                'old': '45-49',
                'value': cagPositiveData.filter(x => x.tuoi > 44 && x.tuoi < 50).length,
            }, {
                'old': '50+',
                'value': cagPositiveData.filter(x => x.tuoi > 49).length,
            }];
            let oldpositiveCategoryAxis = chartOldPositive.xAxes.push(new am4charts.CategoryAxis());
            oldpositiveCategoryAxis.dataFields.category = 'old';
            oldpositiveCategoryAxis.renderer.grid.template.location = 0;
            oldpositiveCategoryAxis.renderer.grid.template.strokeWidth = 0;
            oldpositiveCategoryAxis.renderer.minGridDistance = 30;
            oldpositiveCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
                // tslint:disable-next-line:no-bitwise
                // if (target.dataItem && target.dataItem.index && 2= = =2) {
                // return dy + 25;
                // }
                return dy;
            });
            let oldpositiveValueAxis = chartOldPositive.yAxes.push(new am4charts.ValueAxis());
            oldpositiveValueAxis.extraMax = 0.1;
            oldpositiveValueAxis.numberFormatter = new am4core.NumberFormatter();
            oldpositiveValueAxis.numberFormatter.numberFormat = '#.';
            let oldpositiveseries = chartOldPositive.series.push(new am4charts.ColumnSeries());
            oldpositiveseries.dataFields.valueY = 'value';
            oldpositiveseries.dataFields.categoryX = 'old';
            oldpositiveseries.name = 'Tuổi';
            // oldpositiveseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            oldpositiveseries.columns.template.fillOpacity = 1;
            oldpositiveseries.columns.template.fill = am4core.color('#4EC4FF');
            oldpositiveseries.columns.template.width = 28;
            oldpositiveseries.calculatePercent = true;
            let oldpositiveBullet = oldpositiveseries.bullets.push(new am4charts.LabelBullet());
            oldpositiveBullet.label.verticalCenter = 'bottom';
            oldpositiveBullet.label.dy = 0;
            oldpositiveBullet.label.wrap = false;
            oldpositiveBullet.label.truncate = false;
            oldpositiveBullet.label.text = '[bold]{values.valueY.workingValue}[/] ({valueY.percent.formatNumber(\'#.0\')}%)';
            //#endregion

            //#region Tỷ lệ người bệnh được chẩn đoán viêm gan C mạn được điều trị
            let chartBeginTreatment = am4core.create('vgc-chart-beingtreatment', am4charts.PieChart);
            chartBeginTreatment.innerRadius = am4core.percent(30);
            chartBeginTreatment.data = [

                {
                    'insurance': 'Số người được điều trị',
                    'value': cagPositiveData.filter(x => x.coDungThuocViemGanC).length,
                    'color': am4core.color('#4EC4FF'),
                }, {
                    'insurance': 'Số người không được điều trị',
                    'value': cagPositiveData.filter(x => !x.coDungThuocViemGanC).length,
                    'color': am4core.color('#E05252'),
                },
            ];
            let beingtreatmentseries = chartBeginTreatment.series.push(new am4charts.PieSeries());
            beingtreatmentseries.dataFields.value = 'value';
            beingtreatmentseries.dataFields.category = 'insurance';
            beingtreatmentseries.slices.template.stroke = am4core.color('#fff');
            beingtreatmentseries.slices.template.strokeOpacity = 1;
            beingtreatmentseries.hiddenState.properties.opacity = 1;
            beingtreatmentseries.hiddenState.properties.endAngle = -90;
            beingtreatmentseries.hiddenState.properties.startAngle = -90;
            beingtreatmentseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            beingtreatmentseries.slices.template.propertyFields.fill = 'color';
            beingtreatmentseries.ticks.template.disabled = true;
            beingtreatmentseries.alignLabels = false;
            beingtreatmentseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            beingtreatmentseries.labels.template.radius = am4core.percent(-30);
            beingtreatmentseries.labels.template.fill = am4core.color('white');
            chartBeginTreatment.legend = new am4charts.Legend();
            beingtreatmentseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartBeginTreatment.hiddenState.properties.radius = am4core.percent(0);
            chartBeginTreatment.legend.markers.template.width = 12;
            chartBeginTreatment.legend.markers.template.height = 12;
            const markerBeingTreatment: any = chartBeginTreatment.legend.markers.template.children.getIndex(0);
            markerBeingTreatment.cornerRadius(6, 6, 6, 6);
            //#endregion

            //#region Số người bệnh điều trị viêm gan C theo tỉnh
            let topTinhNhiemManDieuTri = [];
            countTop = 0;
            for (let i = groupByTinhSort.length - 1; i > -1; i--) {
                if (countTop < 6) {
                    topTinhNhiemManDieuTri.push(
                        {
                            'city': groupByTinhSort[i]['tenTinh'] + ' (' + groupByTinhSort[i]['soNhiemMan'] + ')',
                            'person': groupByTinhSort[i]['soNhiemMan'],
                            'treatment': groupByTinhSort[i]['soDieuTri'],
                            'notreatment': groupByTinhSort[i]['soNhiemMan'] - groupByTinhSort[i]['soDieuTri'],
                        },
                    );
                }
                countTop = countTop + 1;
            }
            let chartInfectionTreatment = am4core.create('vgc-chart-infection-treatment', am4charts.XYChart);
            chartInfectionTreatment.data = topTinhNhiemManDieuTri;
            let infectiontreatmentCategoryAxis = chartInfectionTreatment.xAxes.push(new am4charts.CategoryAxis());
            infectiontreatmentCategoryAxis.dataFields.category = 'city';
            infectiontreatmentCategoryAxis.renderer.grid.template.location = 0;
            infectiontreatmentCategoryAxis.renderer.grid.template.strokeWidth = 0;
            infectiontreatmentCategoryAxis.renderer.minGridDistance = 30;
            infectiontreatmentCategoryAxis.renderer.labels.template.wrap = true;
            infectiontreatmentCategoryAxis.renderer.labels.template.maxWidth = 80;
            infectiontreatmentCategoryAxis.renderer.labels.template.textAlign = 'middle';
            let infectiontreatmentValueAxis = chartInfectionTreatment.yAxes.push(new am4charts.ValueAxis());
            infectiontreatmentValueAxis.extraMax = 0.1;
            //infectiontreatmentValueAxis.title.text = 'Thông tin về số người nhiễm mạn và điều trị theo tỉnh';
            //valueAxis.title.fontWeight = 800;
            let infectionseries = chartInfectionTreatment.series.push(new am4charts.ColumnSeries());
            infectionseries.dataFields.valueY = 'notreatment';
            infectionseries.dataFields.categoryX = 'city';
            infectionseries.clustered = false;
            infectionseries.stacked = true;
            infectionseries.columns.template.fill = am4core.color('#2AE1AA');
            infectionseries.columns.template.strokeWidth = 0;
            infectionseries.columns.template.width = 28;
            //infectionseries.tooltipText = '{categoryX}-Số người nhiễm:  [bold]{valueY}[/]';
            // infectionseries.tooltipText = 'Số nhiễm:  [bold]{valueY}[/]';
            let infectionBullet = infectionseries.bullets.push(new am4charts.LabelBullet());
            infectionBullet.label.wrap = false;
            infectionBullet.locationY = 0.5;
            infectionBullet.label.truncate = false;
            infectionBullet.label.text = '{values.valueY.workingValue}';

            let treatmentseries = chartInfectionTreatment.series.push(new am4charts.ColumnSeries());
            treatmentseries.dataFields.valueY = 'treatment';
            treatmentseries.dataFields.categoryX = 'city';
            treatmentseries.clustered = false;
            treatmentseries.stacked = true;
            treatmentseries.columns.template.fill = am4core.color('#5491CD');
            treatmentseries.columns.template.strokeWidth = 0;
            treatmentseries.columns.template.width = 28;
            // treatmentseries.tooltipText = '{categoryX}-Số điều trị: [bold]{valueY}[/]';
            // treatmentseries.tooltipText = 'Số điều trị: [bold]{valueY}[/]';
            chartInfectionTreatment.cursor = new am4charts.XYCursor();
            chartInfectionTreatment.cursor.lineX.disabled = true;
            chartInfectionTreatment.cursor.lineY.disabled = true;
            let treatmentBullet = treatmentseries.bullets.push(new am4charts.LabelBullet());
            treatmentBullet.locationY = 0.5;
            treatmentBullet.label.wrap = false;
            treatmentBullet.label.truncate = false;
            treatmentBullet.label.text = '{values.valueY.workingValue}';
            //#endregion

            //#region Số người bệnh hoàn thành điều trị và khỏi bệnh (đạt SVR12) Giới tính + Độ tuổi
            // let chartSexCure = am4core.create('vgc-chart-sex-cure', am4charts.PieChart);
            // // let sexCureDate = dataTongHop.filter(x => x.viemGanCMan === true && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.hcvarN_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG && x.soNgayDieuTriViemGanC > 83);
            // let sexCureDate = dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG) && (x.ketQuaDieuTri === 1 || x.ketQuaDieuTri === 2));
            // chartSexCure.innerRadius = am4core.percent(30);
            // chartSexCure.data = [
            //     {
            //         'sex': 'Nam',
            //         'value': sexCureDate.filter(x => x.gioiTinh === GIOI_TINH.NAM).length,
            //         'color': am4core.color('#16C8BE'),
            //     },
            //     {
            //         'sex': 'Nữ',
            //         'value': sexCureDate.filter(x => x.gioiTinh === GIOI_TINH.NU).length,
            //         'color': am4core.color('#F2C94C'),
            //     },
            // ];
            // let sexcureseries = chartSexCure.series.push(new am4charts.PieSeries());
            // sexcureseries.dataFields.value = 'value';
            // sexcureseries.dataFields.category = 'sex';
            // sexcureseries.slices.template.stroke = am4core.color('#fff');
            // sexcureseries.slices.template.strokeOpacity = 1;
            // sexcureseries.hiddenState.properties.opacity = 1;
            // sexcureseries.hiddenState.properties.endAngle = -90;
            // sexcureseries.hiddenState.properties.startAngle = -90;
            // sexcureseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            // sexcureseries.slices.template.propertyFields.fill = 'color';
            // sexcureseries.ticks.template.disabled = true;
            // sexcureseries.alignLabels = false;
            // sexcureseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            // sexcureseries.labels.template.radius = am4core.percent(-30);
            // sexcureseries.labels.template.fill = am4core.color('white');
            // chartSexCure.legend = new am4charts.Legend();
            // sexcureseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            // chartSexCure.hiddenState.properties.radius = am4core.percent(0);
            // chartSexCure.legend.markers.template.width = 12;
            // chartSexCure.legend.markers.template.height = 12;
            // const markerSexCure: any = chartSexCure.legend.markers.template.children.getIndex(0);
            // markerSexCure.cornerRadius(6, 6, 6, 6);
            //
            // let chartOldCure = am4core.create('vgc-chart-old-cure', am4charts.XYChart);
            // chartOldCure.data = [{
            //     'old': '<15',
            //     'value': sexCureDate.filter(x => x.tuoi < 15).length,
            // }, {
            //     'old': '15-19',
            //     'value': sexCureDate.filter(x => x.tuoi > 14 && x.tuoi < 20).length,
            // }, {
            //     'old': '20-24',
            //     'value': sexCureDate.filter(x => x.tuoi > 19 && x.tuoi < 25).length,
            // }, {
            //     'old': '25-29',
            //     'value': sexCureDate.filter(x => x.tuoi > 24 && x.tuoi < 30).length,
            // }, {
            //     'old': '30-34',
            //     'value': sexCureDate.filter(x => x.tuoi > 29 && x.tuoi < 35).length,
            // }, {
            //     'old': '35-39',
            //     'value': sexCureDate.filter(x => x.tuoi > 34 && x.tuoi < 40).length,
            // }, {
            //     'old': '40-44',
            //     'value': sexCureDate.filter(x => x.tuoi > 39 && x.tuoi < 45).length,
            // }, {
            //     'old': '45-49',
            //     'value': sexCureDate.filter(x => x.tuoi > 44 && x.tuoi < 50).length,
            // }, {
            //     'old': '50+',
            //     'value': sexCureDate.filter(x => x.tuoi > 49).length,
            // }];
            // let oldcureCategoryAxis = chartOldCure.xAxes.push(new am4charts.CategoryAxis());
            // oldcureCategoryAxis.dataFields.category = 'old';
            // oldcureCategoryAxis.renderer.grid.template.location = 0;
            // oldcureCategoryAxis.renderer.grid.template.strokeWidth = 0;
            // oldcureCategoryAxis.renderer.minGridDistance = 30;
            // oldcureCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
            //     // tslint:disable-next-line:no-bitwise
            //     // if (target.dataItem && target.dataItem.index && 2= = =2) {
            //     // return dy + 25;
            //     // }
            //     return dy;
            // });
            // let oldcureValueAxis = chartOldCure.yAxes.push(new am4charts.ValueAxis());
            // oldcureValueAxis.extraMax = 0.1;
            // ;
            // oldcureValueAxis.min = 0;
            // oldcureValueAxis.numberFormatter = new am4core.NumberFormatter();
            // oldcureValueAxis.numberFormatter.numberFormat = '#.';
            // let oldcureseries = chartOldCure.series.push(new am4charts.ColumnSeries());
            // oldcureseries.dataFields.valueY = 'value';
            // oldcureseries.dataFields.categoryX = 'old';
            // oldcureseries.name = 'Tuổi';
            // oldcureseries.calculatePercent = true;
            // //oldcureseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            // oldcureseries.columns.template.fillOpacity = 1;
            // oldcureseries.columns.template.fill = am4core.color('#4EC4FF');
            // oldcureseries.columns.template.width = 28;
            // let oldcureBullet = oldcureseries.bullets.push(new am4charts.LabelBullet());
            // oldcureBullet.label.verticalCenter = 'bottom';
            // oldcureBullet.label.dy = 0;
            // oldcureBullet.label.wrap = false;
            // oldcureBullet.label.truncate = false;
            // oldcureBullet.label.text = '[bold]{values.valueY.workingValue}[/] ({valueY.percent.formatNumber(\'#.0\')}%)';

            let chartCure = am4core.create('vgc-chart-cure', am4charts.PieChart);
            // let sexCureDate = dataTongHop.filter(x => x.viemGanCMan === true && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.hcvarN_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG && x.soNgayDieuTriViemGanC > 83);
            let cureDate = dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG));
            chartCure.innerRadius = am4core.percent(30);
            chartCure.data = [
                {
                    'sex': 'Số khỏi bệnh',
                    'value': cureDate.filter(x => x.ketQuaDieuTri === 1 || x.ketQuaDieuTri === 2).length,
                    'color': am4core.color('#16C8BE'),
                },
                {
                    'sex': 'Số không khỏi',
                    'value': cureDate.filter(x => x.ketQuaDieuTri !== 1 && x.ketQuaDieuTri !== 2).length,
                    'color': am4core.color('#F2C94C'),
                },
            ];
            let cureseries = chartCure.series.push(new am4charts.PieSeries());
            cureseries.dataFields.value = 'value';
            cureseries.dataFields.category = 'sex';
            cureseries.slices.template.stroke = am4core.color('#fff');
            cureseries.slices.template.strokeOpacity = 1;
            cureseries.hiddenState.properties.opacity = 1;
            cureseries.hiddenState.properties.endAngle = -90;
            cureseries.hiddenState.properties.startAngle = -90;
            cureseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            cureseries.slices.template.propertyFields.fill = 'color';
            cureseries.ticks.template.disabled = true;
            cureseries.alignLabels = false;
            cureseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            cureseries.labels.template.radius = am4core.percent(-30);
            cureseries.labels.template.fill = am4core.color('white');
            chartCure.legend = new am4charts.Legend();
            cureseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartCure.hiddenState.properties.radius = am4core.percent(0);
            chartCure.legend.markers.template.width = 12;
            chartCure.legend.markers.template.height = 12;
            const markerCure: any = chartCure.legend.markers.template.children.getIndex(0);
            markerCure.cornerRadius(6, 6, 6, 6);

            //#endregion

            //#region Mô hình đa bậc xét nghiệm và điều trị viêm gan C
            let chartMultiLevel = am4core.create('vgc-chart-multi-level', am4charts.XYChart);
            const VGC_BatDauDieuTri = dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG)).length;
            const VGC_HoanThanhDieuTri = dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG)).length;
            // const VGC_KhoiBenh = dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.soNgayDieuTriViemGanC > 83 && x.hcvarN_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG).length;
            const VGC_KhoiBenh = dataTongHop.filter(x => x.viemGanCMan === true && x.soLanDieuTri_ViemGanC > 0 && (x.ngayKetThuc_ViemGanC !== null && x.ngayKetThuc_ViemGanC !== undefined) && x.antiHCV_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && (x.hcVcAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH || x.hcvarN_Nguong === NHOM_NGUONG.TREN_NGUONG) && (x.ketQuaDieuTri === 1 || x.ketQuaDieuTri === 2)).length;
            chartMultiLevel.data = [{
                'level': 'Xét nghiệm anti-HCV',
                'value': tongSangLoc,
                'ratio': 100,
            }, {
                'level': 'Anti-HCV dương tính',
                'value': sangLocDuongTinh,
                'ratio': (sangLocDuongTinh * 100 / tongSangLoc),
            }, {
                'level': 'Xét nghiệm khẳng định viêm gan C',
                'value': VGC_XetNghiemKhangDinh,
                'ratio': VGC_XetNghiemKhangDinh * 100 / sangLocDuongTinh,
            }, {
                'level': 'Chẩn đoán viêm gan C',
                'value': VGC_XetNghiemKhangDinhChuanDoan,
                'ratio': VGC_XetNghiemKhangDinhChuanDoan * 100 / VGC_XetNghiemKhangDinh,
            }, {
                'level': 'Bắt đầu điều trị',
                'value': VGC_BatDauDieuTri,
                'ratio': VGC_BatDauDieuTri * 100 / VGC_XetNghiemKhangDinhChuanDoan,
            }, {
                'level': 'Khỏi bệnh (SVR12)',
                'value': VGC_KhoiBenh,
                'ratio': VGC_KhoiBenh * 100 / VGC_HoanThanhDieuTri,
            }];
            let multilevelCategoryAxis = chartMultiLevel.xAxes.push(new am4charts.CategoryAxis());
            multilevelCategoryAxis.dataFields.category = 'level';
            multilevelCategoryAxis.renderer.grid.template.location = 0;
            multilevelCategoryAxis.renderer.grid.template.strokeWidth = 0;
            multilevelCategoryAxis.renderer.minGridDistance = 30;
            multilevelCategoryAxis.renderer.labels.template.wrap = true;
            multilevelCategoryAxis.renderer.labels.template.maxWidth = 115;
            multilevelCategoryAxis.renderer.labels.template.textAlign = 'middle';
            multilevelCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
                // tslint:disable-next-line:no-bitwise
                // if (target.dataItem && target.dataItem.index && 2= = =2) {
                // return dy + 25;
                // }
                return dy;
            });
            let multilevelValueAxis = chartMultiLevel.yAxes.push(new am4charts.ValueAxis());
            multilevelValueAxis.extraMax = 0.1;
            multilevelValueAxis.numberFormatter = new am4core.NumberFormatter();
            multilevelValueAxis.numberFormatter.numberFormat = '#.';
            multilevelValueAxis.min = 0;
            let multilevelseries = chartMultiLevel.series.push(new am4charts.ColumnSeries());
            multilevelseries.dataFields.valueY = 'value';
            multilevelseries.dataFields.categoryX = 'level';
            multilevelseries.dataFields.customValue = 'ratio';
            multilevelseries.name = 'Level';
            multilevelseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            multilevelseries.columns.template.fillOpacity = 1;
            multilevelseries.columns.template.fill = am4core.color('#16C8BE');
            multilevelseries.columns.template.width = 28;
            multilevelseries.columns.template.dummyData = 'ratio';
            multilevelseries.columns.template.tooltipText = '[bold]{categoryX}[/]\nTỷ lệ: {customValue.formatNumber(\'#.0\')} %';
            let multilevelBullet = multilevelseries.bullets.push(new am4charts.LabelBullet());
            multilevelBullet.label.verticalCenter = 'bottom';
            //multilevelBullet.label.dy = 0;
            multilevelBullet.label.wrap = false;
            multilevelBullet.label.truncate = false;
            multilevelBullet.label.text = '{values.valueY.workingValue}';
            //#endregion

            //#region Số người bệnh điều trị viêm gan C có sử dụng bảo hiểm y tế
            let chartTreatmentInsurance = am4core.create('vgc-chart-treatment-insurance', am4charts.PieChart);
            let treatmentinsurance = dataTongHopBHYT.filter(x => x.viemGanCMan && x.coDungThuocViemGanC);
            chartTreatmentInsurance.innerRadius = am4core.percent(30);
            chartTreatmentInsurance.data = [
                {
                    'insurance': 'Số người sử dụng BHYT',
                    'value': treatmentinsurance.filter(x => x.bhyt === BAO_HIEM_Y_TE.BHYT_CO).length,
                    'color': am4core.color('#4EC4FF'),
                }, {
                    'insurance': 'Số người không sử dụng BHYT',
                    'value': treatmentinsurance.filter(x => x.bhyt === BAO_HIEM_Y_TE.BHYT_KHONG).length,
                    'color': am4core.color('#E05252'),
                },
            ];
            let treatmentinsuranceseries = chartTreatmentInsurance.series.push(new am4charts.PieSeries());
            treatmentinsuranceseries.dataFields.value = 'value';
            treatmentinsuranceseries.dataFields.category = 'insurance';
            treatmentinsuranceseries.slices.template.stroke = am4core.color('#fff');
            treatmentinsuranceseries.slices.template.strokeOpacity = 1;
            treatmentinsuranceseries.hiddenState.properties.opacity = 1;
            treatmentinsuranceseries.hiddenState.properties.endAngle = -90;
            treatmentinsuranceseries.hiddenState.properties.startAngle = -90;
            treatmentinsuranceseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            treatmentinsuranceseries.slices.template.propertyFields.fill = 'color';
            treatmentinsuranceseries.ticks.template.disabled = true;
            treatmentinsuranceseries.alignLabels = false;
            treatmentinsuranceseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            treatmentinsuranceseries.labels.template.radius = am4core.percent(-30);
            treatmentinsuranceseries.labels.template.fill = am4core.color('white');
            chartTreatmentInsurance.legend = new am4charts.Legend();
            treatmentinsuranceseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartTreatmentInsurance.hiddenState.properties.radius = am4core.percent(0);
            chartTreatmentInsurance.legend.markers.template.width = 12;
            chartTreatmentInsurance.legend.markers.template.height = 12;
            const markerTreatmentInsurance: any = chartTreatmentInsurance.legend.markers.template.children.getIndex(0);
            markerTreatmentInsurance.cornerRadius(6, 6, 6, 6);
            //#endregion
        });
    }
}
