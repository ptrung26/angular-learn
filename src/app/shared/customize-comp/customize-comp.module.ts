import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenViewPdfModalComponent } from './open-view-pdf/open-view-pdf-modal.component';
import { DirViewPdfComponent } from '@app/shared/customize-comp/open-view-pdf/dir-view-pdf.component';
import { SafePipe } from '@app/shared/customize-comp/pipe/SafePipe';
import { AngularEditorModule } from '@node_modules/@kolkov/angular-editor';
import { OraEditorComponent } from './ora-editor/ora-editor.component';
import { XoaTextTinhPipe } from './pipe/xoa-text-tinh';
import { XoaTextXaPipe } from '@app/shared/customize-comp/pipe/xoa-text-xa';
import { XoaTextHuyenPipe } from '@app/shared/customize-comp/pipe/xoa-text-huyen';
import { OraNumberStrPipe } from './pipe/ora-numberStrPipe';
import { DropDownUploadExcelComponent } from '@app/shared/customize-comp/drop-down-upload-excel/drop-down-upload-excel.component';
import { OraDataPickerComponent } from '@app/shared/customize-comp/ora-data-picker/ora-data-picker.component';
import { ImgTempModalComponent } from '@app/shared/customize-comp/img-temp-modal/img-temp-modal.component';
import { ImgTempSelectComponent } from '@app/shared/customize-comp/img-temp-select/img-temp-select.component';
import { ImageCropperModule } from '@node_modules/ngx-image-cropper';
import { UtilsModule } from '@shared/utils/utils.module';
import { OraNumberV2 } from '@app/shared/customize-comp/pipe/ora-number-v2.pipe';
import { CircleDataComponent } from './circle-data/circle-data.component';
import { ProgressBarWithPointComponent } from './progress-bar-with-point/progress-bar-with-point.component';
import { OraNumberRollbackComponent } from '@app/shared/customize-comp/ora-number-rollback/ora-number-rollback.component';
import { UppercaseFirstWordPipe } from './pipe/uppercase-first-word.pipe';
import { ProgressBarType2Component } from './progress-bar-type2/progress-bar-type2.component';
import { CountoModule } from '@node_modules/angular2-counto';
import { OraSliderComponent } from './ora-slider/ora-slider.component';
import { OraRollbackComponent } from '@app/shared/customize-comp/ora-rollback/ora-rollback.component';
import { AbsPipe } from './pipe/abs.pipe';
import { UppercaseFirstLetterPipe } from './pipe/uppercase-first-letter.pipe';
import { StringToObjPipe } from './pipe/string-to-obj.pipe';
import { ReplaceSomeTextPipe } from './pipe/replace-some-text.pipe';
import { OraColorPickerComponent } from './ora-color-picker/ora-color-picker.component';
import { ColorPickerModule } from '@node_modules/ngx-color-picker';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';
import { OraStepsComponent } from './ora-steps/ora-steps.component';
import { OraStepComponent } from './ora-steps/ora-step/ora-step.component';
import { NzOutletModule } from '@node_modules/ng-zorro-antd/core/outlet';
import { OraSwitchComponent } from './ora-switch/ora-switch.component';
import { OraListSwitchComponent } from './ora-list-switch/ora-list-switch.component';
import { TextMaskModule } from 'angular2-text-mask';
import { OraLayoutFilterComponent } from './ora-layout-filter/ora-layout-filter.component';
import { OraPageHeaderComponent } from './ora-page-header/ora-page-header.component';
import { DropDownUploadExcelArrayComponent } from './drop-down-upload-excel/drop-down-upload-excel-array.component';

const com = [
    SafePipe,
    OpenViewPdfModalComponent,
    DirViewPdfComponent,
    OraEditorComponent,
    XoaTextXaPipe,
    XoaTextHuyenPipe,
    XoaTextTinhPipe,
    OraNumberStrPipe,
    OraNumberV2,
    DropDownUploadExcelComponent,
    DropDownUploadExcelArrayComponent,
    OraDataPickerComponent,
    ImgTempModalComponent,
    ImgTempSelectComponent,
    CircleDataComponent,
    ProgressBarWithPointComponent,
    OraNumberRollbackComponent,
    OraRollbackComponent,
    ProgressBarType2Component,
    UppercaseFirstWordPipe,
    UppercaseFirstLetterPipe,
    StringToObjPipe,
    AbsPipe,
    OraSliderComponent,
    OraColorPickerComponent,
    ReplaceSomeTextPipe,
    OraStepsComponent,
    OraStepComponent,
    OraSwitchComponent, OraListSwitchComponent,
    OraLayoutFilterComponent,
    OraPageHeaderComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...SHARED_ZORRO_MODULES,
        AngularEditorModule,
        TextMaskModule,
        ImageCropperModule,
        UtilsModule,
        CountoModule,
        ColorPickerModule,
        NzOutletModule,
    ],
    declarations: [...com],
    exports: [...com, ],
    providers: [],
})
export class CustomizeCompModule {

}

