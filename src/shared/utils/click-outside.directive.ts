import {Directive, ElementRef, HostListener, Input, Output, EventEmitter} from '@angular/core';


@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {
    constructor(private _elementRef: ElementRef) {
    }

    @Input() activeClickOutside = true;
    // tslint:disable-next-line:no-output-rename
    @Output('clickOutsideAndOverlay') clickOutsideAndOverlay: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line:no-output-rename
    @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

    @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
        if (this.activeClickOutside) {
            const clickedInside = this._elementRef.nativeElement.contains(targetElement);
            if (!clickedInside) {
                this.clickOutside.emit(null);
            }
            if (this.clickOutsideAndOverlay) {
                const overlayContainer = document.getElementsByClassName('cdk-overlay-container')[0];
                if (overlayContainer) {
                    const isClickInsiteOverlay = overlayContainer.contains(targetElement);
                    if (clickedInside) {
                        // if (isClickInsiteOverlay) {
                        //     this.clickOutsideAndOverlay.emit(null);
                        // }
                    } else {
                        if (!isClickInsiteOverlay) {
                            this.clickOutsideAndOverlay.emit(null);
                        }
                    }
                } else {
                    if (clickedInside) {
                        // if (isClickInsiteOverlay) {
                        //     this.clickOutsideAndOverlay.emit(null);
                        // }
                    } else {
                        this.clickOutsideAndOverlay.emit(null);
                    }
                }

            }


        }
    }


}
