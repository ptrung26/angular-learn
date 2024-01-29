import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CongThucDinhDuongService {
    // Chuyển đổi dinh dưỡng của 100g thực phẩm sang đơn vị mặc định
    // số lượng thực phẩm (grams)
    //hamLuongDinhDuong: Hàm lượng dinh dưỡng trong 100g thực phẩm
    //Tỷ lệ quy đổi ra grams
    convertDinhDuongFrom100gThucPham(soLuongTP: number, hamLuongDinhDuong: number, tyLeQuyDoi: number): number {
        const res = (soLuongTP ? soLuongTP : 0) * hamLuongDinhDuong * tyLeQuyDoi / 100;
        return res;

    }

    constructor() {
    }
}
