import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {

    constructor() {
    }

    printFilePdf(byteArray: string) {
        const arrrayBuffer = base64ToArrayBuffer(byteArray); //data is the base64 encoded string
        function base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64);
            const binaryLen = binaryString.length;
            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                const ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
            }
            return bytes;
        }

        const blob = new Blob([arrrayBuffer], {type: 'application/pdf'});
        const link = window.URL.createObjectURL(blob);
        // const win = window.open(link, '', 'height=650,width=840'); Popup
        const win = window.open(link, '_blank');

        const ua = window.navigator.userAgent;
        const mozilla = ua.indexOf('Mozilla/');
        if (mozilla < 0) {
            win.print();
        } else {
            setTimeout(() => {
                win.print();
            }, 2000);
        }
    }
}
