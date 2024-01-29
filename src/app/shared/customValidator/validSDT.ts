import {AbstractControl} from '@angular/forms';

export function validSDT(c: AbstractControl) {
    const v = c.value;
    // const regex_SDT_Ban: RegExp = /^(\()?(0|\+84)?2((\d{2}(\)|\.)?(\ )?(\d)(\.)?(\d{3})(\.)?(\d{3}))|((4)|(8))(\)|\.)?(\ )?(\d{2})(\.)?(\d{3})(\.)?(\d{3}))$/;
    // const regex_SDT_Dd: RegExp = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    const regex_SDT_Ban: RegExp = /^(\()?([0])?2((\d{2}(\)|\.)?(\ )?(\d)(\.)?(\d{3})(\.)?(\d{3}))|((4)|(8))(\)|\.)?(\ )?(\d{2})(\.)?(\d{3})(\.)?(\d{3}))$/;
    const regex_SDT_Dd: RegExp = /^([0])?(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    if (v) {
        if (regex_SDT_Dd.test(v) === false && regex_SDT_Ban.test(v) === false) {
            return {
                sdtKhongHopLe: true
            };
        }
        return;
    }
    return;
}
