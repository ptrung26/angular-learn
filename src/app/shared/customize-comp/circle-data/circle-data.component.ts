import {Component, Input, OnInit} from '@angular/core';
import {NzProgressStrokeColorType} from '@node_modules/ng-zorro-antd/progress/typings';

@Component({
    selector: 'circle-data',
    templateUrl: './circle-data.component.html',
    styles: [`
        .title-data {
            display: block;
            margin-top: 5px
        }

        .process-data {
            display: block;
        }

        :host ::ng-deep .ant-progress-circle.ant-progress-status-success .ant-progress-text {
            font-weight: bold;
            color: #2C353C;
            font-size: 0.85em;
        }

        .khoi-luong {
            color: #2C353C
        }

        .don-vi {
            color: #8991A4
        }

    `]
})
export class CircleDataComponent implements OnInit {
    @Input() title: string;
    @Input() donVi = 'g';
    processColor: NzProgressStrokeColorType = {'0%': 'red', '100%': 'red'};
    @Input() width = 80;
    @Input() slPhanThapPhan = 2;

    // _maMau = '';
    @Input() set maMau(v: string[]) {
        // this._maMau = v;
        this.processColor = {'0%': v[0], '100%': v[1]};
    }

    _value = 0;
    _formatValue = this._value.toString();


    @Input() set value(v: number) {
        this._value = v ? v : 0;
        this._formatValue = this._value.toFixed(this.slPhanThapPhan);
    }

    get value() {
        return this._value;
    }


    constructor() {
    }

    ngOnInit(): void {
    }


}
