import { Component, Input, OnInit } from '@angular/core';
import { TemplateRef } from '@node_modules/@angular/core';

@Component({
    selector: 'ora-page-header',
    templateUrl: './ora-page-header.component.html',
    styleUrls: ['./ora-page-header.component.scss'],
})
export class OraPageHeaderComponent implements OnInit {
    @Input() title: string | TemplateRef<void>;
    @Input() action: string | TemplateRef<void>;

    constructor() {
    }

    ngOnInit(): void {
    }

}
