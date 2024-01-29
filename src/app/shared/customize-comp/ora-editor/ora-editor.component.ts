import {Component, forwardRef, Injector, Input, OnInit, Provider, ViewChild, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {AngularEditorComponent} from '@kolkov/angular-editor';
import {AngularEditorConfig} from '@node_modules/@kolkov/angular-editor/lib/config';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraEditorComponent),
    multi: true
};

@Component({
    selector: 'ora-editor',
    templateUrl: './ora-editor.component.html',
    providers: [VALUE_ACCESSOR],
})

export class OraEditorComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    @Input()
    get value() {
        return this._value;
    }

    set value(v: any) {
        this._value = v;
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    constructor(
        injector: Injector,
    ) {
        super(injector);

    }

    @ViewChild('refEditor', {static: true}) refEditor: AngularEditorComponent;
    _value = '';
    _isDisabled = false;
    @Input() mode: 'edit' | 'show' = 'edit';

    @Input() config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        placeholder: 'Chi tiết nội dung...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
    };
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    async ngOnInit() {
    }

    onChangeValue(event: any): void {
        const test: any = this.refEditor.textArea.nativeElement;
        const res = test.innerHTML ? test.innerHTML : event;
        this.value = res;
        this.onChange(res);
        // this.onChange(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
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
