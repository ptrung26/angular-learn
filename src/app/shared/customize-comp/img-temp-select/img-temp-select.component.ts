import {Component, EventEmitter, forwardRef, Input, OnInit, Provider, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ImgTempModalComponent, IDataImgOut} from '@app/shared/customize-comp/img-temp-modal/img-temp-modal.component';
import {AppConsts} from '@shared/AppConsts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';


const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImgTempSelectComponent),
    multi: true
};

const imgLinkBase: string = AppConsts.remoteServiceBaseUrl + '/File/GoToViewImage?imgId=';

@Component({
    selector: 'img-temp-select',
    templateUrl: './img-temp-select.component.html',
    styleUrls: ['./img-temp-select.component.scss'],
    providers: [VALUE_ACCESSOR]
})
export class ImgTempSelectComponent implements OnInit {
    // imgPath='/assets/common/images/custom/img-mon-an-default.png';
    @Input() isCircleImg = false;
    @Input() tileModal = 'Sửa ảnh';
    @Input() srcImgDefault = '/assets/common/icon/notFoundMonAn.svg';

    _imgIdInit: string;

    @Input() get imgIdLinkInit(): string {
        return this._imgIdLinkInit;
    }

    set imgIdLinkInit(v: string) {
        if (v) {
            this._imgIdInit = v;
            this._imgIdLinkInit = imgLinkBase + v;
        }
    }


    @Input()
    get value() {
        return this._value;
    }

    set value(v: string) {
        this._value = v;
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    constructor(private msg: NzMessageService,
                private modalService: NzModalService,
    ) {
    }

    _value = '';
    _isDisabled = false;
    imgByteArrSource = '';
    _imgIdLinkInit = '';

    @Input() imgWidth: '100%';
    @Input() imgHeight: '200px';
    @Input() showBtnButton = false;
    @Input() imgWidthNeed = 150;
    @Output() imgIdInitChange = new EventEmitter<string>();
    @Output() imgSrcChange = new EventEmitter<string>();
    @Input() isOpenPopUp = true;
    @Input() aspectRatio = true;

    private onChange: Function = (v: string) => {
    };
    private onTouched: Function = () => {
    };

    showSelecImgModal() {
        if (this.isOpenPopUp) {
            const modal = this.modalService.create({
                nzTitle: this.tileModal,
                nzContent: ImgTempModalComponent,
                nzComponentParams: {
                    imgWidthNeed: this.imgWidthNeed,
                    aspectRatio: this.aspectRatio,
                },
                nzFooter: null
            });

            modal.afterClose.subscribe((result: IDataImgOut) => {
                if (result) {
                    this.imgByteArrSource = result.imgByte;
                    this.imgSrcChange.emit(result.imgByte);
                    this.onChange(result.fileToken);
                    console.log(result, 'resultIMGOutput');
                }
            });
        }
    }

    deleteImg() {
        this.imgByteArrSource = '';
        this._imgIdInit = '';
        this._imgIdLinkInit = '';
        this.imgSrcChange.emit('');

        this.onChange(null);
    }

    ngOnInit() {

    }


    writeValue(obj: string): void {
        this._value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }
}
