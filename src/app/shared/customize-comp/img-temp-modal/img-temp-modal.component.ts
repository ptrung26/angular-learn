import {Component, Injector, Input, OnInit} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {FileItem, FileUploader, FileUploaderOptions} from '@node_modules/ng2-file-upload';
import {IAjaxResponse, TokenService} from '@node_modules/abp-ng2-module';
import {base64ToFile, ImageCroppedEvent} from '@node_modules/ngx-image-cropper';
import {AppConsts} from '@shared/AppConsts';
import { NzModalRef } from '@node_modules/ng-zorro-antd/modal';

export interface IDataImgOut {
    imgByte: string | undefined;
    fileToken: string | undefined;
}

@Component({
    templateUrl: './img-temp-modal.component.html',
})
export class ImgTempModalComponent extends AppComponentBase implements OnInit {
    @Input() imgWidthNeed = 128;
    @Input() aspectRatio = true;

    public uploader: FileUploader;
    public temporaryPictureUrl: string;
    public saving = false;

    maxProfilPictureBytesUserFriendlyValue = 5;
    private temporaryPictureFileName: string;
    private _uploaderOptions: FileUploaderOptions = {};

    imgBase64AfterCrop = '';
    imageChangedEvent: any = '';
    nzModalRef: NzModalRef;


    constructor(
        injector: Injector,
        private _tokenService: TokenService
    ) {
        super(injector);
        this.nzModalRef = injector.get(NzModalRef);

    }

    ngOnInit() {
        this.initializeModal();
    }

    initializeModal(): void {
        this.temporaryPictureUrl = '';
        this.temporaryPictureFileName = '';
        this.initFileUploader();
    }

    close(dataOut?: IDataImgOut): void {
        this.imageChangedEvent = '';
        this.uploader.clearQueue();
        this.nzModalRef.close(dataOut);

    }


    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCroppedFile(event: ImageCroppedEvent) {
        this.uploader.clearQueue();
        this.imgBase64AfterCrop = event.base64;
        this.uploader.addToQueue([<File>base64ToFile(event.base64)]);
    }

    initFileUploader(): void {
        this.uploader = new FileUploader({url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture'});
        this._uploaderOptions.autoUpload = false;
        this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        this._uploaderOptions.removeAfterUpload = true;
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
            form.append('FileType', fileItem.file.type);
            form.append('FileName', 'ProfilePicture');
            form.append('FileToken', this.guid());
        };

        this.uploader.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                this.updateProfilePicture(resp.result.fileToken);
            } else {
                this.message.error(resp.error.message);
            }
        };

        this.uploader.setOptions(this._uploaderOptions);
    }

    updateProfilePicture(fileToken: string): void {
        this.saving = true;
        setTimeout(() => {
            this.close({
                fileToken: fileToken,
                imgByte: this.imgBase64AfterCrop
            });
        }, 1000);


    }

    guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    save(): void {
        this.uploader.uploadAll();
    }
}
