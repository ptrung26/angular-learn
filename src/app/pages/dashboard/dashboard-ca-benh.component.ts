import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
    BAO_HIEM_Y_TE,
    DashboardOutputDto,
    DashboardServiceProxy,
    GIOI_TINH,
    NHOM_BENH,
    USER_LEVEL,
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './dashboard-ca-benh.component.html',
    styleUrls: ['./dashboard-ca-benh.component.less'],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.Emulated,
})
export class DashboardCaBenhComponent extends AppComponentBase implements OnInit {
    isSpinning = false;
    rfFormGroup: FormGroup;
    userLevel = USER_LEVEL;
    nhomBenh = NHOM_BENH;
    gioiTinh = GIOI_TINH;
    filterMaTinh = '';
    filterDonViCoSoId = -1;
    filterNhomBenh = 1;
    filterBHYT = -1;
    //Text search
    selectedTinh = '';
    selectedCoSo = '';
    selectedBHYT = '';
    selectedNhomBenh = '';
    selectedNgay = '';
    selectedNam = '';
    //Số liệu hiển thị ra dashboard
    dashboardName = '';
    placeRangePicker = ['Ngày bắt đầu', 'Ngày kết thúc'];
    tuNgay = '';
    denNgay = '';
    result: DashboardOutputDto;
    yearBC = [];
    maxYear: number = new Date().getFullYear();

    constructor(
        injector: Injector,
        private _dataService: DashboardServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            maTinh: [''],
            donViCoSoId: [null],
            baoHiemYTe: [-1],
            nhomBenh: [NHOM_BENH.VIEM_GAN_B],
            rangeDate: [],
            nam: [this.maxYear - 1],
        });
    }

    ngOnInit(): void {
        for (let i = 2021; i <= this.maxYear; i++) {
            this.yearBC.push(i);
        }
        this.refresh();
    }

    changeTinh(event) {
        if (event) {
            this.selectedTinh = event;
        }
    }

    changeCoSo(event) {
        if (event) {
            this.selectedCoSo = '; ' + event;
        }
    }

    changeNam(event) {
        this.tuNgay = '01/01/' + this.rfFormGroup.value.nam;
        this.denNgay = '31/12/' + this.rfFormGroup.value.nam;
        this.selectedNgay = '; Từ ngày ' + this.tuNgay + ' đến ngày ' + this.denNgay;
        this.refresh();
    }

    rangeDateChange(result: Date[]): void {
        if (result.length > 0) {
            this.tuNgay = result[0].getDate().toString().padStart(2, '0') + '/' + (result[0].getMonth() + 1).toString().padStart(2, '0') + '/' + result[0].getFullYear().toString();
            this.denNgay = result[1].getDate().toString().padStart(2, '0') + '/' + (result[1].getMonth() + 1).toString().padStart(2, '0') + '/' + result[1].getFullYear().toString();
        } else {
            this.tuNgay = '';
            this.denNgay = '';
        }
    }

    groupByKey(data, key) {
        return data.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    refresh(): void {
        this.isSpinning = true;
        this.selectedTinh = 'Toàn quốc';
        this.selectedCoSo = '';
        this.selectedBHYT = '';
        this.selectedNhomBenh = '';
        this.selectedNgay = '';
        this.tuNgay = '01/01/' + this.rfFormGroup.value.nam;
        this.denNgay = '31/12/' + this.rfFormGroup.value.nam;
        if (this.rfFormGroup.value.baoHiemYTe === BAO_HIEM_Y_TE.BHYT_CO) {
            this.selectedBHYT = '; Có bảo hiểm y tế';
        } else if (this.rfFormGroup.value.baoHiemYTe === BAO_HIEM_Y_TE.BHYT_KHONG) {
            this.selectedBHYT = '; Không có bảo hiểm y tế';
        }
        if (this.rfFormGroup.value.nhomBenh === this.nhomBenh.VIEM_GAN_B) {
            this.selectedNhomBenh = '; Bệnh viêm gan B';
        } else {
            this.selectedNhomBenh = '; Bệnh viêm gan C';
        }
        if (this.tuNgay && this.denNgay) {
            this.selectedNgay = '; Từ ngày ' + this.tuNgay + ' đến ngày ' + this.denNgay;
        }
        this.selectedNam = '; Năm ' + this.rfFormGroup.value.nam;
        if (this.appSession.user.level === this.userLevel.SO_Y_TE) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
            this.selectedTinh = this.appSession.user.tenTinh;
        }
        if (this.appSession.user.level === this.userLevel.BENH_VIEN) {
            this.rfFormGroup.get('maTinh').setValue(this.appSession.user.maTinh);
            this.selectedTinh = this.appSession.user.tenTinh;
            this.rfFormGroup.get('donViCoSoId').setValue(this.appSession.user.donViCoSoId.toString());
            this.selectedCoSo = '; ' + this.appSession.user.tenCoSo;
        }
        this.filterMaTinh = this.rfFormGroup.value.maTinh;
        this.filterDonViCoSoId = this.rfFormGroup.value.donViCoSoId;
        this.filterNhomBenh = this.rfFormGroup.value.nhomBenh;
        this.filterBHYT = this.rfFormGroup.value.baoHiemYTe;
        if ((this.appSession.user.level === this.userLevel.BO_Y_TE || this.appSession.user.level === this.userLevel.SA || this.appSession.user.level === null) && (this.rfFormGroup.value.maTinh === '' || this.rfFormGroup.value.maTinh === null) && this.rfFormGroup.value.donViCoSoId < 1) {
            this.dashboardName = 'boyte';
        } else if ((this.appSession.user.level === this.userLevel.SO_Y_TE || this.appSession.user.level === this.userLevel.QUAN_LY_VUNG || this.rfFormGroup.value.maTinh !== '') && this.rfFormGroup.value.donViCoSoId < 1) {
            this.dashboardName = 'soyte';
        } else if (this.appSession.user.level === this.userLevel.BENH_VIEN || (this.rfFormGroup.value.maTinh !== '' && this.rfFormGroup.value.donViCoSoId > 0)) {
            this.dashboardName = 'cosoyte';
        }
        this.isSpinning = false;
    }
}
