import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';
import {tryCatch} from '@node_modules/rxjs/internal/util/tryCatch';

@Pipe({
    name: 'oraNumberV2'
})
export class OraNumberV2 implements PipeTransform {

    constructor() {
    }

    public transform(value: any, fractionDigits: number = 0): any {
        if (typeof (value) === 'number') {
            return value.toFixed(fractionDigits);
        } else if (typeof (value) === 'string') {
            try {
                parseFloat(value).toFixed(fractionDigits);
            } catch (e) {
                console.warn('Lỗi', e);
            }
        }
        return value;
    }
}
