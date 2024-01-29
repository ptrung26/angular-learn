import {Inject, LOCALE_ID, Pipe, PipeTransform, Type} from '@angular/core';
import {formatNumber} from '@angular/common';
import {stringify} from 'querystring';


@Pipe({name: 'oraNumber'})
export class OraNumberStrPipe implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private _locale: string) {
    }


    transform(value: any, digitsInfo?: string, locale?: string): string | null {
        if (this.isEmpty(value)) {
            return null;
        }

        locale = locale || 'vi'; //this._locale;

        try {
            if (typeof (value) === 'string' && value.trim() === '-') {
                return '-';
            } else if (typeof (value) === 'string' && value.includes('-')) {
                const arr = value.split('-');
                const gt1 = this.transform1Value(arr[0], digitsInfo, locale);
                const gt2 = this.transform1Value(arr[1], digitsInfo, locale);
                return gt1 + ' - ' + gt2;
            } else if (typeof (value) === 'string' && value.startsWith('<')) {
                const arr = value.split('<');
                const gt1 = this.transform1Value(arr[1], digitsInfo, locale);
                return '<' + gt1;
            } else if (typeof (value) === 'string' && value.startsWith('>')) {
                const arr = value.split('>');
                const gt1 = this.transform1Value(arr[1], digitsInfo, locale);
                return '>' + gt1;
            }
            const num = this.strToNumber(value);
            if (locale === 'vi') {
                return this.formatNumberViNotThousandPoint(num, digitsInfo);
            } else {
                return formatNumber(num, locale, digitsInfo);
            }
        } catch (error) {
            return value;
        }
    }


    /**
     * @param value The number to be formatted.
     * @param digitsInfo Decimal representation options, specified by a string
     * in the following format:<br>
     * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
     *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
     * Default is `1`.
     *   - `minFractionDigits`: The minimum number of digits after the decimal point.
     * Default is `0`.
     *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
     * Default is `3`.
     * @param locale A locale code for the locale format rules to use.
     * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
     * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
     */
    transform1Value(value: any, digitsInfo?: string, locale?: string): string | null {
        if (this.isEmpty(value)) {
            return null;
        }

        locale = locale || this._locale;

        try {
            const num = this.strToNumber(value);
            if (locale === 'vi') {
                return this.formatNumberViNotThousandPoint(num, digitsInfo);
            } else {
                return formatNumber(num, locale, digitsInfo);
            }
        } catch (error) {
            throw this.invalidPipeArgumentError(OraNumberStrPipe, error.message);
        }
    }

    formatNumberViNotThousandPoint(value: any, digitsInfo?: string): string {
        const res = formatNumber(value, 'en', digitsInfo);
        return res.replace(',', '');
    }


    isEmpty(value: any): boolean {
        return value == null || value === '' || value !== value;
    }

    strToNumber(value: number | string): number {
        // Convert strings to numbers
        if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
            return Number(value);
        }
        if (typeof value !== 'number') {
            throw new Error(`${value} is not a number`);
        }
        return value;
    }

    invalidPipeArgumentError(type: Type<any>, value: Object) {
        // @ts-ignore
        return Error(`InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
    }


}
