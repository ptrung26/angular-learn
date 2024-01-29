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
    selector: 'vgb-co-so-y-te',
    templateUrl: './vgb-co-so-y-te.component.html',
    encapsulation: ViewEncapsulation.Emulated,
})
export class VgbCoSoYTeComponent extends AppComponentBase implements OnInit, OnChanges {
    @Input() maTinh: string;
    @Input() donViCoSoId: number;
    @Input() baoHiemYTe: number;
    @Input() nhomBenh: number;
    @Input() tuNgay: string;
    @Input() denNgay: string;
    userLevel = USER_LEVEL;
    isSpinning = true;
    //Số liệu hiển thị ra dashboard
    dataTongHopBHYT: DashboardDto[] = [];
    dataTongHop: DashboardDto[] = []; //Lọc theo BHYT
    tongSangLoc = 0;
    sangLocDuongTinh = 0;
    sangLocDuongTinhPercent = 0;
    dongNhiemBC = '';
    dongNhiemBHIV = '';
    dongNhiemBD = '';
    tuVong = 0;
    xetNghiem_ChanDoan = 0;
    nhiemMan_ChanDoan = 0;
    xetNghiem_DieuTri = 0;
    groupByMonth = [];
    groupByMonthSort = [];
    groupByMonthSortDesc = [];
    dieuTriBHYT = 0;
    VGB_SoMoiDieuTri = 0;
    VGB_SoDangDieuTri = 0;


    result: DashboardOutputDto;
    vgbcsytscreeningtestlabel = [];
    vgbcsytscreeningtestpositivelable = [];
    tyleucchevirus = 0;

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
        this.dongNhiemBC = '';
        this.dongNhiemBHIV = '';
        this.dongNhiemBD = '';
        this.tuVong = 0;
        this.xetNghiem_ChanDoan = 0;
        this.nhiemMan_ChanDoan = 0;
        this.xetNghiem_DieuTri = 0;
        this.groupByMonth = [];
        this.groupByMonthSort = [];
        this.groupByMonthSortDesc = [];
        this.dieuTriBHYT = 0;
        this.VGB_SoMoiDieuTri = 0;
        this.VGB_SoDangDieuTri = 0;
        this.vgbcsytscreeningtestlabel = ['0', '0', '0', '0'];
        this.vgbcsytscreeningtestpositivelable = ['0', '0', '0', '0'];
        this.tyleucchevirus = 0;


        let tongHopRequest = new DashboardTongHopRequest();
        tongHopRequest.maTinh = this.maTinh;
        tongHopRequest.donViCoSoId = this.donViCoSoId;
        tongHopRequest.nhomBenh = this.nhomBenh;
        tongHopRequest.tuNgay = this.tuNgay;
        tongHopRequest.denNgay = this.denNgay;

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
                this.sangLocDuongTinh = this.dataTongHop.filter(x => x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length;
                if (this.dataTongHop.length > 0) {
                    this.sangLocDuongTinhPercent = this.sangLocDuongTinh * 100 / this.dataTongHop.length;
                }
                this.xetNghiem_ChanDoan = this.dataTongHop.filter(x => (x.hbvdnA_NgayLam !== null && x.hbvdnA_NgayLam !== undefined)).length; // có giá trị ngưỡng nghĩa là có làm
                // this.nhiemMan_ChanDoan = dataTongHop.filter(x => x.viemGanBMan === true && x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length;
                this.nhiemMan_ChanDoan = this.dataTongHop.filter(x => x.viemGanBMan === true).length;
                this.xetNghiem_DieuTri = this.dataTongHop.filter(x => x.hbvdnA_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG).length;
                this.dieuTriBHYT = this.dataTongHopBHYT.filter(x => x.soLanDieuTri_ViemGanB > 0 && x.bhyt === BAO_HIEM_Y_TE.BHYT_CO).length;
                //Group tháng
                let sortNgayLamXetNghiem = _.sortBy(_.cloneDeep(this.dataTongHop), 'hBsAg_NgayLam');
                this.groupByMonth = this.groupByKey(sortNgayLamXetNghiem, 'hBsAg_ThangLam');
                (Object.keys(this.groupByMonth)).forEach(x => {
                    this.groupByMonthSort.push(
                        {
                            thang: x,
                            soBenhNhan: this.groupByMonth[x].length,
                            soDuongTinh: this.groupByMonth[x].filter(x => x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length,
                        },
                    );
                });
                //this.groupByMonthSort = _.sortBy(this.groupByMonthSort, 'hBsAg_ThangLam');

                this.dongNhiemBHIV = result.dongNhiemBHIV;
                this.dongNhiemBD = result.dongNhiemBD;
                this.tuVong = this.dataTongHop.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB === true && x.tuVong === true).length;
                this.VGB_SoMoiDieuTri = this.dataTongHop.filter(x => x.viemGanBMan === true && x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH && x.duTieuChuanDieuTri === true).length;
                this.VGB_SoDangDieuTri = this.dataTongHop.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB === true && x.thangBatDau_ViemGanB === '12/2022').length;

                let vgbcsytscreeningtestNam = _.cloneDeep(this.dataTongHop).filter(x => x.gioiTinh === GIOI_TINH.NAM).length;
                let vgbcsytscreeningtestNu = _.cloneDeep(this.dataTongHop).filter(x => x.gioiTinh === GIOI_TINH.NU).length;
                if (this.dataTongHop.length > 0) {
                    this.vgbcsytscreeningtestlabel = [];
                    this.vgbcsytscreeningtestlabel.push(vgbcsytscreeningtestNam);
                    let vgbcsytscreeningtestNamPercent = (vgbcsytscreeningtestNam * 100 / this.dataTongHop.length).toFixed(1);
                    this.vgbcsytscreeningtestlabel.push(vgbcsytscreeningtestNamPercent);
                    this.vgbcsytscreeningtestlabel.push(vgbcsytscreeningtestNu);
                    this.vgbcsytscreeningtestlabel.push((100 - parseFloat(vgbcsytscreeningtestNamPercent)).toFixed(1));
                }
                let vgbcsytscreeningtestpositiveNam = _.cloneDeep(this.dataTongHop).filter(x => x.gioiTinh === GIOI_TINH.NAM && x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length;
                let vgbcsytscreeningtestpositiveNu = _.cloneDeep(this.dataTongHop).filter(x => x.gioiTinh === GIOI_TINH.NU && x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length;
                if (this.dataTongHop.length > 0) {
                    this.vgbcsytscreeningtestpositivelable = [];
                    this.vgbcsytscreeningtestpositivelable.push(vgbcsytscreeningtestpositiveNam);
                    let vgbcsytscreeningtestpositiveNamPercent = (vgbcsytscreeningtestpositiveNam * 100 / this.dataTongHop.filter(x => x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH).length).toFixed(1);
                    this.vgbcsytscreeningtestpositivelable.push(vgbcsytscreeningtestpositiveNamPercent);
                    this.vgbcsytscreeningtestpositivelable.push(vgbcsytscreeningtestpositiveNu);
                    this.vgbcsytscreeningtestpositivelable.push((100 - parseFloat(vgbcsytscreeningtestpositiveNamPercent)).toFixed(1));
                }

                let topMonthData = [];
                for (let i = 0; i < this.groupByMonthSort.length; i++) {
                    topMonthData.push({
                        'date': this.groupByMonthSort[i]['thang'],
                        'test': this.groupByMonthSort[i]['soBenhNhan'],
                        'positive': this.groupByMonthSort[i]['soDuongTinh'],
                    });
                }

                let groupByValueHBVDNA = this.groupByKey(_.cloneDeep(this.dataTongHop.filter(x => x.hbvdnA_Nguong === NHOM_NGUONG.TREN_NGUONG && (x.hbvdnA_NgayLam !== null && x.hbvdnA_NgayLam !== undefined))), 'hbvdnA_ChiSo');
                let groupByValueHBVDNASort = [];
                (Object.keys(groupByValueHBVDNA)).forEach(x => {
                    groupByValueHBVDNASort.push(
                        {
                            chiSo: x,
                            soBenhNhan: groupByValueHBVDNA[x].length,
                        },
                    );
                });
                let groupByValueHBVDNASortASC = _.sortBy(_.cloneDeep(groupByValueHBVDNASort), ['soBenhNhan', 'chiSo'], ['asc', 'asc']);
                let valueHBVDNAData = [];
                for (let i = 0; i < groupByValueHBVDNASortASC.length; i++) {
                    valueHBVDNAData.push(
                        {
                            'chiSo': groupByValueHBVDNASortASC[i]['chiSo'],
                            'soBenhNhan': groupByValueHBVDNASortASC[i]['soBenhNhan'],
                        },
                    );
                }
                let trenNguong = this.dataTongHop.filter(x => x.viemGanBMan && x.coDungThuocViemGanB && x.hbvdnA_LanCuoi_Nguong === NHOM_NGUONG.TREN_NGUONG && (x.hbvdnA_LanCuoi_NgayLam !== null && x.hbvdnA_LanCuoi_NgayLam !== undefined)).length;
                let duoiNguong = this.dataTongHop.filter(x => x.viemGanBMan && x.coDungThuocViemGanB && x.hbvdnA_LanCuoi_Nguong === NHOM_NGUONG.DUOI_NGUONG && (x.hbvdnA_LanCuoi_NgayLam !== null && x.hbvdnA_LanCuoi_NgayLam !== undefined)).length;
                if (this.VGB_SoDangDieuTri > 0) {
                    this.tyleucchevirus = duoiNguong * 100 / this.VGB_SoDangDieuTri;
                }
                this.getChart(this.dataTongHop, this.dataTongHopBHYT, topMonthData, valueHBVDNAData, this.tongSangLoc, this.sangLocDuongTinh, trenNguong, duoiNguong);
                abp.ui.clearBusy();
            });
    }

    groupByKey(data, key) {
        return data.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    getChart(dataTongHop, dataTongHopBHYT, topMonthData, valueHBVDNAData, tongSangLoc, sangLocDuongTinh, trenNguong, duoiNguong) {
        am4core.ready(function() {
            am4core.useTheme(am4themes_animated);

            //#region Số người xét nghiệm HBsAg
            let chartScreeningTest = am4core.create('vgb-csyt-screening-test', am4charts.XYChart);
            chartScreeningTest.data = [{
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
            }, {
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
            valueTestAxis.renderer.labels.template.adapter.add('text', function(text) {
                return text === 'Male' || text === 'Female' ? text : text + '';
            });
            let maleTest = chartScreeningTest.series.push(new am4charts.ColumnSeries());
            maleTest.dataFields.valueX = 'male';
            maleTest.dataFields.categoryY = 'age';
            maleTest.clustered = false;
            maleTest.calculatePercent = true;
            maleTest.columns.template.fill = am4core.color('#5491CD');
            maleTest.columns.template.strokeOpacity = 0;

            let maleTestLabel = maleTest.bullets.push(new am4charts.LabelBullet());
            maleTestLabel.label.text = '[bold]{valueX}[/]\n[font-size: 12px]({valueX.percent}%)[/]';
            maleTestLabel.label.hideOversized = false;
            maleTestLabel.label.truncate = false;
            maleTestLabel.label.horizontalCenter = 'right';
            maleTestLabel.label.dx = 0;

            let femaleTest = chartScreeningTest.series.push(new am4charts.ColumnSeries());
            femaleTest.dataFields.valueX = 'female';
            femaleTest.dataFields.categoryY = 'age';
            femaleTest.clustered = false;
            femaleTest.calculatePercent = true;
            femaleTest.columns.template.fill = am4core.color('#FFC2BC');
            femaleTest.columns.template.strokeOpacity = 0;

            let femaleTestLabel = femaleTest.bullets.push(new am4charts.LabelBullet());
            femaleTestLabel.label.text = '[bold]{valueX}[/]\n[font-size: 12px]({valueX.percent}%)[/]';
            femaleTestLabel.label.hideOversized = false;
            femaleTestLabel.label.truncate = false;
            femaleTestLabel.label.horizontalCenter = 'left';
            femaleTestLabel.label.dx = 0;
            //#endregion

            //#region Số người xét nghiệm HBsAg
            let screeningTestPositive = dataTongHop.filter(x => x.hBsAg_KetQua === KET_QUA_XET_NGHIEM.DUONG_TINH);
            let chartScreeningPositive = am4core.create('vgb-csyt-screening-test-positive', am4charts.XYChart);
            chartScreeningPositive.data = [
                {
                    'age': '50+ [bold](' + (screeningTestPositive.filter(x => x.tuoi > 49).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 49 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 49 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '45-49 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 44 && x.tuoi < 50).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 44 && x.tuoi < 50 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 44 && x.tuoi < 50 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '40-44 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 39 && x.tuoi < 45).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 39 && x.tuoi < 45 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 39 && x.tuoi < 45 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '35-39 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 34 && x.tuoi < 40).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 34 && x.tuoi < 40 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 34 && x.tuoi < 40 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '30-34 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 29 && x.tuoi < 35).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 29 && x.tuoi < 35 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 29 && x.tuoi < 35 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '25-29 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 24 && x.tuoi < 30).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 24 && x.tuoi < 30 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 24 && x.tuoi < 30 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '20-24 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 19 && x.tuoi < 25).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 19 && x.tuoi < 25 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 19 && x.tuoi < 25 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '15-19 [bold](' + (screeningTestPositive.filter(x => x.tuoi > 14 && x.tuoi < 20).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi > 14 && x.tuoi < 20 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi > 14 && x.tuoi < 20 && x.gioiTinh === GIOI_TINH.NU).length,
                },
                {
                    'age': '<15 [bold](' + (screeningTestPositive.filter(x => x.tuoi < 15).length) + ')[/]',
                    'male': (screeningTestPositive.filter(x => x.tuoi < 15 && x.gioiTinh === GIOI_TINH.NAM).length) * -1,
                    'female': screeningTestPositive.filter(x => x.tuoi < 15 && x.gioiTinh === GIOI_TINH.NU).length,
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

            //#region Kết quả xét nghiệm nghiệm HBsAg theo tháng
            let chartMonth = am4core.create('vgb-csyt-chart-month', am4charts.XYChart);
            chartMonth.data = topMonthData;
            let monthCategoryAxis = chartMonth.xAxes.push(new am4charts.CategoryAxis());
            monthCategoryAxis.dataFields.category = 'date';

            let monthValueAxis = chartMonth.yAxes.push(new am4charts.ValueAxis());
            monthValueAxis.extraMax = 0.1;
            // monthValueAxis.title.text = 'Xét nghiệm';
            monthValueAxis.numberFormatter = new am4core.NumberFormatter();
            monthValueAxis.numberFormatter.numberFormat = '#.';
            //monthValueAxis.renderer.minLabelPosition = 0.5;

            let monthtestSeries = chartMonth.series.push(new am4charts.LineSeries());
            monthtestSeries.dataFields.valueY = 'test';
            monthtestSeries.dataFields.categoryX = 'date';
            monthtestSeries.name = 'Xét nghiệm';
            monthtestSeries.bullets.push(new am4charts.CircleBullet());
            monthtestSeries.tooltipText = 'Xét nghiệm tháng {categoryX}: {valueY}';
            monthtestSeries.tooltip.getFillFromObject = false;
            monthtestSeries.tooltip.background.fill = am4core.color('#5491CD');
            monthtestSeries.legendSettings.valueText = '{valueY}';
            monthtestSeries.visible = false;
            //monthtestSeries.stroke = am4core.color('#5491CD');
            monthtestSeries.strokeWidth = 2;
            let monthtestBullet = monthtestSeries.bullets.push(new am4charts.CircleBullet());
            monthtestBullet.circle.radius = 6;
            monthtestBullet.circle.fill = am4core.color('#fff');
            monthtestBullet.circle.strokeWidth = 2;

            let monthpositiveSeries = chartMonth.series.push(new am4charts.LineSeries());
            monthpositiveSeries.dataFields.valueY = 'positive';
            monthpositiveSeries.dataFields.categoryX = 'date';
            monthpositiveSeries.name = 'Dương tính';
            monthpositiveSeries.tooltipText = 'Dương tính tháng {categoryX}: {valueY}';
            monthpositiveSeries.tooltip.getFillFromObject = false;
            monthpositiveSeries.tooltip.background.fill = am4core.color('#E05252');
            monthpositiveSeries.legendSettings.valueText = '{valueY}';
            monthpositiveSeries.stroke = am4core.color('#E05252');
            monthpositiveSeries.strokeWidth = 2;
            let monthpositiveBullet = monthpositiveSeries.bullets.push(new am4charts.CircleBullet());
            monthpositiveBullet.circle.radius = 6;
            monthpositiveBullet.circle.fill = am4core.color('#fff');
            monthpositiveBullet.circle.strokeWidth = 2;
            chartMonth.cursor = new am4charts.XYCursor();
            chartMonth.cursor.behavior = 'zoomY';
            // let hs1 = monthtestSeries.segments.template.states.create('hover');
            // hs1.properties.strokeWidth = 5;
            // hs1.properties.fill = am4core.color('#E05252');
            // monthtestSeries.segments.template.strokeWidth = 1;
            // let hs2 = monthpositiveseries.segments.template.states.create('hover');
            // hs2.properties.strokeWidth = 5;
            // monthpositiveseries.segments.template.strokeWidth = 1;
            //#endregion

            //#region Số người bệnh viêm gan B mạn Giới tính + Độ tuổi
            let infection = dataTongHop.filter(x => x.viemGanBMan === true);
            let chartSexInfection = am4core.create('vgb-csyt-chart-sex-infection', am4charts.PieChart);
            chartSexInfection.innerRadius = am4core.percent(30);
            chartSexInfection.data = [
                {
                    'sex': 'Nam',
                    'value': infection.filter(x => x.gioiTinh === GIOI_TINH.NAM).length,
                    'color': am4core.color('#16C8BE'),
                },
                {
                    'sex': 'Nữ',
                    'value': infection.filter(x => x.gioiTinh === GIOI_TINH.NU).length,
                    'color': am4core.color('#F2C94C'),
                },
            ];
            let sexinfectionseries = chartSexInfection.series.push(new am4charts.PieSeries());
            sexinfectionseries.dataFields.value = 'value';
            sexinfectionseries.dataFields.category = 'sex';
            sexinfectionseries.slices.template.stroke = am4core.color('#fff');
            sexinfectionseries.slices.template.strokeOpacity = 1;
            sexinfectionseries.hiddenState.properties.opacity = 1;
            sexinfectionseries.hiddenState.properties.endAngle = -90;
            sexinfectionseries.hiddenState.properties.startAngle = -90;
            sexinfectionseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            sexinfectionseries.slices.template.propertyFields.fill = 'color';
            sexinfectionseries.ticks.template.disabled = true;
            sexinfectionseries.alignLabels = false;
            sexinfectionseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            sexinfectionseries.labels.template.radius = am4core.percent(-30);
            sexinfectionseries.labels.template.fill = am4core.color('white');
            chartSexInfection.legend = new am4charts.Legend();
            sexinfectionseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartSexInfection.hiddenState.properties.radius = am4core.percent(0);
            chartSexInfection.legend.markers.template.width = 12;
            chartSexInfection.legend.markers.template.height = 12;
            const markerSexInfection: any = chartSexInfection.legend.markers.template.children.getIndex(0);
            markerSexInfection.cornerRadius(6, 6, 6, 6);

            let chartOldInfection = am4core.create('vgb-csyt-chart-old-infection', am4charts.XYChart);
            chartOldInfection.data = [{
                'old': '<15',
                'value': infection.filter(x => x.tuoi < 15).length,
            }, {
                'old': '15-19',
                'value': infection.filter(x => x.tuoi > 14 && x.tuoi < 20).length,
            }, {
                'old': '20-24',
                'value': infection.filter(x => x.tuoi > 19 && x.tuoi < 25).length,
            }, {
                'old': '25-29',
                'value': infection.filter(x => x.tuoi > 24 && x.tuoi < 30).length,
            }, {
                'old': '30-34',
                'value': infection.filter(x => x.tuoi > 29 && x.tuoi < 35).length,
            }, {
                'old': '35-39',
                'value': infection.filter(x => x.tuoi > 34 && x.tuoi < 40).length,
            }, {
                'old': '40-44',
                'value': infection.filter(x => x.tuoi > 39 && x.tuoi < 45).length,
            }, {
                'old': '45-49',
                'value': infection.filter(x => x.tuoi > 44 && x.tuoi < 50).length,
            }, {
                'old': '50+',
                'value': infection.filter(x => x.tuoi > 49).length,
            }];
            let oldinfectionCategoryAxis = chartOldInfection.xAxes.push(new am4charts.CategoryAxis());
            oldinfectionCategoryAxis.dataFields.category = 'old';
            oldinfectionCategoryAxis.renderer.grid.template.location = 0;
            oldinfectionCategoryAxis.renderer.grid.template.strokeWidth = 0;
            oldinfectionCategoryAxis.renderer.minGridDistance = 30;
            oldinfectionCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
                // tslint:disable-next-line:no-bitwise
                // if (target.dataItem && target.dataItem.index && 2= = =2) {
                // return dy + 25;
                // }
                return dy;
            });
            let oldinfectionValueAxis = chartOldInfection.yAxes.push(new am4charts.ValueAxis());
            oldinfectionValueAxis.extraMax = 0.1;
            oldinfectionValueAxis.numberFormatter = new am4core.NumberFormatter();
            oldinfectionValueAxis.numberFormatter.numberFormat = '#.';
            let oldinfectionseries = chartOldInfection.series.push(new am4charts.ColumnSeries());
            oldinfectionseries.calculatePercent = true;
            oldinfectionseries.dataFields.valueY = 'value';
            oldinfectionseries.dataFields.categoryX = 'old';
            oldinfectionseries.name = 'Tuổi';
            // oldinfectionseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            oldinfectionseries.columns.template.fillOpacity = 1;
            oldinfectionseries.columns.template.fill = am4core.color('#4EC4FF');
            oldinfectionseries.columns.template.width = 28;
            let oldinfectionBullet = oldinfectionseries.bullets.push(new am4charts.LabelBullet());
            oldinfectionBullet.label.verticalCenter = 'bottom';
            oldinfectionBullet.label.dy = 0;
            oldinfectionBullet.label.wrap = false;
            oldinfectionBullet.label.truncate = false;
            oldinfectionBullet.label.text = '[bold]{values.valueY.workingValue}[/] ({valueY.percent.formatNumber(\'#.0\')}%)';
            //#endregion

            //#region Chẩn đoán_Số người bệnh viêm gan B xét nghiệm tải lượng HBV DNA và nhận kết quả
            let chartTestHBVDNA = am4core.create('vgb-csyt-chart-test-hbv-dna', am4charts.PieChart);
            chartTestHBVDNA.innerRadius = am4core.percent(30);
            chartTestHBVDNA.data = [
                {
                    'text': 'HBV DNA trên ngưỡng phát hiện',
                    'value': dataTongHop.filter(x => x.hbvdnA_Nguong === NHOM_NGUONG.TREN_NGUONG && (x.hbvdnA_NgayLam !== null && x.hbvdnA_NgayLam !== undefined)).length,
                    'color': am4core.color('#4472c4'),
                },
                {
                    'text': 'HBV DNA dưới ngưỡng phát hiện',
                    'value': dataTongHop.filter(x => x.hbvdnA_Nguong === NHOM_NGUONG.DUOI_NGUONG && (x.hbvdnA_NgayLam !== null && x.hbvdnA_NgayLam !== undefined)).length,
                    'color': am4core.color('#ed7d31'),
                },
            ];
            let testhbvdnaseries = chartTestHBVDNA.series.push(new am4charts.PieSeries());
            testhbvdnaseries.dataFields.value = 'value';
            testhbvdnaseries.dataFields.category = 'text';
            testhbvdnaseries.slices.template.stroke = am4core.color('#fff');
            testhbvdnaseries.slices.template.strokeOpacity = 1;
            testhbvdnaseries.hiddenState.properties.opacity = 1;
            testhbvdnaseries.hiddenState.properties.endAngle = -90;
            testhbvdnaseries.hiddenState.properties.startAngle = -90;
            testhbvdnaseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            testhbvdnaseries.slices.template.propertyFields.fill = 'color';
            chartTestHBVDNA.hiddenState.properties.radius = am4core.percent(0);
            testhbvdnaseries.ticks.template.disabled = true;
            testhbvdnaseries.alignLabels = false;
            testhbvdnaseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            testhbvdnaseries.labels.template.radius = am4core.percent(-30);
            testhbvdnaseries.labels.template.fill = am4core.color('white');
            chartTestHBVDNA.legend = new am4charts.Legend();
            testhbvdnaseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartTestHBVDNA.hiddenState.properties.radius = am4core.percent(0);
            chartTestHBVDNA.legend.markers.template.width = 12;
            chartTestHBVDNA.legend.markers.template.height = 12;
            const markerTestHBVDNA: any = chartTestHBVDNA.legend.markers.template.children.getIndex(0);
            markerTestHBVDNA.cornerRadius(6, 6, 6, 6);
            //#endregion

            //#region Chẩn đoán_Phân bố giá trị tải lượng

            let chartValueHBVDNA = am4core.create('vgb-csyt-chart-value-hbv-dna', am4charts.XYChart);
            chartValueHBVDNA.data = valueHBVDNAData;
            let valueHBVDNAXAxis = chartValueHBVDNA.xAxes.push(new am4charts.ValueAxis());
            let valueHBVDNAYAxis = chartValueHBVDNA.yAxes.push(new am4charts.ValueAxis());
            valueHBVDNAYAxis.title.text = 'Tải lượng HBV DNA (IU/ml)';
            let valueHBVDNASeries = chartValueHBVDNA.series.push(new am4charts.LineSeries());
            valueHBVDNASeries.dataFields.valueY = 'chiSo';
            valueHBVDNASeries.dataFields.valueX = 'soBenhNhan';
            valueHBVDNASeries.dataFields.value = 'giaTri';
            valueHBVDNASeries.strokeOpacity = 0;
            let bulletValueHBVDNA = valueHBVDNASeries.bullets.push(new am4charts.CircleBullet());
            bulletValueHBVDNA.strokeOpacity = 0.2;
            bulletValueHBVDNA.stroke = am4core.color('#ffffff');
            bulletValueHBVDNA.tooltipText = 'Chỉ số {valueY}: {valueX} người';
            //#endregion

            //#region Số người bệnh mới điều trị viêm gan B Giới tính + Độ tuổi
//             let starttreatment = dataTongHop.filter(x => x.viemGanBMan === true && x.duTieuChuanDieuTri === true);
//             let chartSexStartTreatment = am4core.create('vgb-csyt-chart-sex-starttreatment', am4charts.PieChart);
//             chartSexStartTreatment.innerRadius = am4core.percent(30);
//             chartSexStartTreatment.data = [
//                 {
//                     'sex': 'Nam',
//                     'value': starttreatment.filter(x => x.gioiTinh === GIOI_TINH.NAM).length,
//                     'color': am4core.color('#16C8BE'),
//                 },
//                 {
//                     'sex': 'Nữ',
//                     'value': starttreatment.filter(x => x.gioiTinh === GIOI_TINH.NU).length,
//                     'color': am4core.color('#F2C94C'),
//                 },
//             ];
//
//             let sexstarttreatmentseries = chartSexStartTreatment.series.push(new am4charts.PieSeries());
//             sexstarttreatmentseries.dataFields.value = 'value';
//             sexstarttreatmentseries.dataFields.category = 'sex';
//             sexstarttreatmentseries.slices.template.stroke = am4core.color('#fff');
//             sexstarttreatmentseries.slices.template.strokeOpacity = 1;
//             sexstarttreatmentseries.hiddenState.properties.opacity = 1;
//             sexstarttreatmentseries.hiddenState.properties.endAngle = -90;
//             sexstarttreatmentseries.hiddenState.properties.startAngle = -90;
//             sexstarttreatmentseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
//             sexstarttreatmentseries.slices.template.propertyFields.fill = 'color';
//             sexstarttreatmentseries.ticks.template.disabled = true;
//             sexstarttreatmentseries.alignLabels = false;
//             sexstarttreatmentseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
//             sexstarttreatmentseries.labels.template.radius = am4core.percent(-30);
//             sexstarttreatmentseries.labels.template.fill = am4core.color('white');
//             chartSexStartTreatment.legend = new am4charts.Legend();
//             sexstarttreatmentseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
// // chartSexStartTreatment.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
//             chartSexStartTreatment.hiddenState.properties.radius = am4core.percent(0);
//             chartSexStartTreatment.legend.markers.template.width = 12;
//             chartSexStartTreatment.legend.markers.template.height = 12;
//             const markerSexStartTreatment: any = chartSexStartTreatment.legend.markers.template.children.getIndex(0);
//             markerSexStartTreatment.cornerRadius(6, 6, 6, 6);
//
//             let chartOldStartTreatment = am4core.create('vgb-csyt-chart-old-starttreatment', am4charts.XYChart);
//             chartOldStartTreatment.data = [{
//                 'old': '<15',
//                 'value': starttreatment.filter(x => x.tuoi < 15).length,
//             }, {
//                 'old': '15-19',
//                 'value': starttreatment.filter(x => x.tuoi > 14 && x.tuoi < 20).length,
//             }, {
//                 'old': '20-24',
//                 'value': starttreatment.filter(x => x.tuoi > 19 && x.tuoi < 25).length,
//             }, {
//                 'old': '25-29',
//                 'value': starttreatment.filter(x => x.tuoi > 24 && x.tuoi < 30).length,
//             }, {
//                 'old': '30-34',
//                 'value': starttreatment.filter(x => x.tuoi > 29 && x.tuoi < 35).length,
//             }, {
//                 'old': '35-39',
//                 'value': starttreatment.filter(x => x.tuoi > 34 && x.tuoi < 40).length,
//             }, {
//                 'old': '40-44',
//                 'value': starttreatment.filter(x => x.tuoi > 39 && x.tuoi < 45).length,
//             }, {
//                 'old': '45-49',
//                 'value': starttreatment.filter(x => x.tuoi > 44 && x.tuoi < 50).length,
//             }, {
//                 'old': '50+',
//                 'value': starttreatment.filter(x => x.tuoi > 49).length,
//             }];
//             let oldstarttreatmentCategoryAxis = chartOldStartTreatment.xAxes.push(new am4charts.CategoryAxis());
//             oldstarttreatmentCategoryAxis.dataFields.category = 'old';
//             oldstarttreatmentCategoryAxis.renderer.grid.template.location = 0;
//             oldstarttreatmentCategoryAxis.renderer.grid.template.strokeWidth = 0;
//             oldstarttreatmentCategoryAxis.renderer.minGridDistance = 30;
//             oldstarttreatmentCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
//                 // tslint:disable-next-line:no-bitwise
//                 // if (target.dataItem && target.dataItem.index && 2= = =2) {
//                 // return dy + 25;
//                 // }
//                 return dy;
//             });
//             let oldstarttreatmentValueAxis = chartOldStartTreatment.yAxes.push(new am4charts.ValueAxis());
//             oldstarttreatmentValueAxis.extraMax = 0.1;
//             oldstarttreatmentValueAxis.numberFormatter = new am4core.NumberFormatter();
//             oldstarttreatmentValueAxis.numberFormatter.numberFormat = '#.';
//             let oldstarttreatmentseries = chartOldStartTreatment.series.push(new am4charts.ColumnSeries());
//             oldstarttreatmentseries.calculatePercent = true;
//             oldstarttreatmentseries.dataFields.valueY = 'value';
//             oldstarttreatmentseries.dataFields.categoryX = 'old';
//             oldstarttreatmentseries.name = 'Tuổi';
// // oldstarttreatmentseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
//             oldstarttreatmentseries.columns.template.fillOpacity = 1;
//             oldstarttreatmentseries.columns.template.fill = am4core.color('#4EC4FF');
//             oldstarttreatmentseries.columns.template.width = 28;
//             let oldstarttreatmentBullet = oldstarttreatmentseries.bullets.push(new am4charts.LabelBullet());
//             oldstarttreatmentBullet.label.verticalCenter = 'bottom';
//             oldstarttreatmentBullet.label.dy = 0;
//             oldstarttreatmentBullet.label.wrap = false;
//             oldstarttreatmentBullet.label.truncate = false;
//             oldstarttreatmentBullet.label.text = '[bold]{values.valueY.workingValue}[/] ({valueY.percent.formatNumber(\'#.0\')}%)';
            //#endregion

            //#region Số người bệnh đang điều trị viêm gan B Giới tính + Độ tuổi
            let beingtreatment = dataTongHop.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB === true && x.thangBatDau_ViemGanB === '12/2022');
            console.log(dataTongHop.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB === true), 'ddt')
            let chartSexBeingTreatment = am4core.create('vgb-csyt-chart-sex-beingtreatment', am4charts.PieChart);
            chartSexBeingTreatment.innerRadius = am4core.percent(30);
            chartSexBeingTreatment.data = [
                {
                    'sex': 'Nam',
                    'value': beingtreatment.filter(x => x.gioiTinh === GIOI_TINH.NAM).length,
                    'color': am4core.color('#16C8BE'),
                },
                {
                    'sex': 'Nữ',
                    'value': beingtreatment.filter(x => x.gioiTinh === GIOI_TINH.NU).length,
                    'color': am4core.color('#F2C94C'),
                },
            ];

            let sexbeingtreatmentseries = chartSexBeingTreatment.series.push(new am4charts.PieSeries());
            sexbeingtreatmentseries.dataFields.value = 'value';
            sexbeingtreatmentseries.dataFields.category = 'sex';
            sexbeingtreatmentseries.slices.template.stroke = am4core.color('#fff');
            sexbeingtreatmentseries.slices.template.strokeOpacity = 1;
            sexbeingtreatmentseries.hiddenState.properties.opacity = 1;
            sexbeingtreatmentseries.hiddenState.properties.endAngle = -90;
            sexbeingtreatmentseries.hiddenState.properties.startAngle = -90;
            sexbeingtreatmentseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            sexbeingtreatmentseries.slices.template.propertyFields.fill = 'color';
            sexbeingtreatmentseries.ticks.template.disabled = true;
            sexbeingtreatmentseries.alignLabels = false;
            sexbeingtreatmentseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            sexbeingtreatmentseries.labels.template.radius = am4core.percent(-30);
            sexbeingtreatmentseries.labels.template.fill = am4core.color('white');
            chartSexBeingTreatment.legend = new am4charts.Legend();
            sexbeingtreatmentseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
// chartSexBeingTreatment.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartSexBeingTreatment.hiddenState.properties.radius = am4core.percent(0);
            chartSexBeingTreatment.legend.markers.template.width = 12;
            chartSexBeingTreatment.legend.markers.template.height = 12;
            const markerSexBeingTreatment: any = chartSexBeingTreatment.legend.markers.template.children.getIndex(0);
            markerSexBeingTreatment.cornerRadius(6, 6, 6, 6);

            let chartOldBeingTreatment = am4core.create('vgb-csyt-chart-old-beingtreatment', am4charts.XYChart);
            chartOldBeingTreatment.data = [{
                'old': '<15',
                'value': beingtreatment.filter(x => x.tuoi < 15).length,
            }, {
                'old': '15-19',
                'value': beingtreatment.filter(x => x.tuoi > 14 && x.tuoi < 20).length,
            }, {
                'old': '20-24',
                'value': beingtreatment.filter(x => x.tuoi > 19 && x.tuoi < 25).length,
            }, {
                'old': '25-29',
                'value': beingtreatment.filter(x => x.tuoi > 24 && x.tuoi < 30).length,
            }, {
                'old': '30-34',
                'value': beingtreatment.filter(x => x.tuoi > 29 && x.tuoi < 35).length,
            }, {
                'old': '35-39',
                'value': beingtreatment.filter(x => x.tuoi > 34 && x.tuoi < 40).length,
            }, {
                'old': '40-44',
                'value': beingtreatment.filter(x => x.tuoi > 39 && x.tuoi < 45).length,
            }, {
                'old': '45-49',
                'value': beingtreatment.filter(x => x.tuoi > 44 && x.tuoi < 50).length,
            }, {
                'old': '50+',
                'value': beingtreatment.filter(x => x.tuoi > 49).length,
            }];
            let oldbeingtreatmentCategoryAxis = chartOldBeingTreatment.xAxes.push(new am4charts.CategoryAxis());
            oldbeingtreatmentCategoryAxis.dataFields.category = 'old';
            oldbeingtreatmentCategoryAxis.renderer.grid.template.location = 0;
            oldbeingtreatmentCategoryAxis.renderer.grid.template.strokeWidth = 0;
            oldbeingtreatmentCategoryAxis.renderer.minGridDistance = 30;
            oldbeingtreatmentCategoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
                // tslint:disable-next-line:no-bitwise
                // if (target.dataItem && target.dataItem.index && 2= = =2) {
                // return dy + 25;
                // }
                return dy;
            });
            let oldbeingtreatmentValueAxis = chartOldBeingTreatment.yAxes.push(new am4charts.ValueAxis());
            oldbeingtreatmentValueAxis.extraMax = 0.1;
            oldbeingtreatmentValueAxis.numberFormatter = new am4core.NumberFormatter();
            oldbeingtreatmentValueAxis.numberFormatter.numberFormat = '#.';
            let oldbeingtreatmentseries = chartOldBeingTreatment.series.push(new am4charts.ColumnSeries());
            oldbeingtreatmentseries.calculatePercent = true;
            oldbeingtreatmentseries.dataFields.valueY = 'value';
            oldbeingtreatmentseries.dataFields.categoryX = 'old';
            oldbeingtreatmentseries.name = 'Tuổi';
// oldbeingtreatmentseries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            oldbeingtreatmentseries.columns.template.fillOpacity = 1;
            oldbeingtreatmentseries.columns.template.fill = am4core.color('#4EC4FF');
            oldbeingtreatmentseries.columns.template.width = 28;
            let oldbeingtreatmentBullet = oldbeingtreatmentseries.bullets.push(new am4charts.LabelBullet());
            oldbeingtreatmentBullet.label.verticalCenter = 'bottom';
            oldbeingtreatmentBullet.label.dy = 0;
            oldbeingtreatmentBullet.label.wrap = false;
            oldbeingtreatmentBullet.label.truncate = false;
            oldbeingtreatmentBullet.label.text = '[bold]{values.valueY.workingValue}[/] ({valueY.percent.formatNumber(\'#.0\')}%)';
            //#endregion

            //#region Mô hình đa bậc xét nghiệm và điều trị viêm gan B
            let chartMultiLevel = am4core.create('vgb-csyt-chart-multi-level', am4charts.XYChart);
            let tieuChuanDieuTri = dataTongHop.filter(x => x.tieuChuanDieuTri === true).length;
            let duTieuChuanDieuTri = dataTongHop.filter(x => x.duTieuChuanDieuTri === true).length;
            chartMultiLevel.data = [{
                'level': 'Xét nghiệm HBsAg',
                'value': tongSangLoc,
                'ratio': 100,
            }, {
                'level': 'HBsAg dương tính',
                'value': sangLocDuongTinh,
                'ratio': tongSangLoc > 0 ? (sangLocDuongTinh * 100 / tongSangLoc) : 0,
            }, {
                'level': 'Đánh giá tiêu chuẩn điều trị',
                'value': tieuChuanDieuTri,
                'ratio': sangLocDuongTinh > 0 ? (tieuChuanDieuTri * 100 / sangLocDuongTinh) : 0,
            }, {
                'level': 'Đủ tiêu chuẩn điều trị',
                'value': duTieuChuanDieuTri,
                'ratio': tieuChuanDieuTri > 0 ? (duTieuChuanDieuTri * 100 / tieuChuanDieuTri) : 0,
            }, {
                'level': 'Được điều trị',
                'value': dataTongHop.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB === true).length,
                'ratio': duTieuChuanDieuTri > 0 ? (dataTongHop.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB === true).length * 100 / duTieuChuanDieuTri) : 0,
            }, {
                'level': 'Tải lượng HBV DNA dưới ngưỡng phát hiện',
                'value': duoiNguong,
                'ratio': beingtreatment.length > 0 ? (duoiNguong * 100 / beingtreatment.length) : 0,
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

            //#region Điều trị_Tỷ lệ người bệnh điều trị viêm gan B có tải lượng HBV DNA dưới ngưỡng phát hiện
            let chartTreatmentHBVDNA = am4core.create('vgb-csyt-chart-treatment-hbv-dna', am4charts.PieChart);
            chartTreatmentHBVDNA.innerRadius = am4core.percent(30);
            chartTreatmentHBVDNA.data = [
                {
                    'text': 'HBV DNA trên ngưỡng phát hiện',
                    'value': trenNguong,
                    'color': am4core.color('#4472c4'),
                },
                {
                    'text': 'HBV DNA dưới ngưỡng phát hiện',
                    'value': duoiNguong,
                    'color': am4core.color('#ed7d31'),
                },
            ];

            let treatmenthbvdnaseries = chartTreatmentHBVDNA.series.push(new am4charts.PieSeries());
            treatmenthbvdnaseries.dataFields.value = 'value';
            treatmenthbvdnaseries.dataFields.category = 'text';
            treatmenthbvdnaseries.slices.template.stroke = am4core.color('#fff');
            treatmenthbvdnaseries.slices.template.strokeOpacity = 1;
            treatmenthbvdnaseries.hiddenState.properties.opacity = 1;
            treatmenthbvdnaseries.hiddenState.properties.endAngle = -90;
            treatmenthbvdnaseries.hiddenState.properties.startAngle = -90;
            treatmenthbvdnaseries.labels.template.text = '[bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) ';
            treatmenthbvdnaseries.slices.template.propertyFields.fill = 'color';
            chartTreatmentHBVDNA.hiddenState.properties.radius = am4core.percent(0);
            treatmenthbvdnaseries.ticks.template.disabled = true;
            treatmenthbvdnaseries.alignLabels = false;
            treatmenthbvdnaseries.labels.template.text = '{value.percent.formatNumber(\'#.00\')}%';
            treatmenthbvdnaseries.labels.template.radius = am4core.percent(-30);
            treatmenthbvdnaseries.labels.template.fill = am4core.color('white');
            chartTreatmentHBVDNA.legend = new am4charts.Legend();
            treatmenthbvdnaseries.legendSettings.itemValueText = ': [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%)';
            // chartSexInfection.legend.labels.template.text = '{sex}: [bold]{value}[/] ({value.percent.formatNumber(\'#.00\')}%) '
            chartTreatmentHBVDNA.hiddenState.properties.radius = am4core.percent(0);
            chartTreatmentHBVDNA.legend.markers.template.width = 12;
            chartTreatmentHBVDNA.legend.markers.template.height = 12;
            const markerTreatmentHBVDNA: any = chartTreatmentHBVDNA.legend.markers.template.children.getIndex(0);
            markerTreatmentHBVDNA.cornerRadius(6, 6, 6, 6);
            //#endregion

            //#region Tổng số người được điều trị VGB có BHYT và không BHYT
            let treatmentinsurance = dataTongHopBHYT.filter(x => x.viemGanBMan === true && x.coDungThuocViemGanB);
            let chartTreatmentInsurance = am4core.create('vgb-csyt-chart-treatment-insurance', am4charts.PieChart);
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
