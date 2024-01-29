import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Observable, Subject } from '@node_modules/rxjs';
import { map, takeUntil } from '@node_modules/rxjs/internal/operators';

@Pipe({
    name: 'tyLeAsyn',
})
export class TyLeAsynPipe implements PipeTransform, OnDestroy {

    _lastedValue: number;
    $destroy = new Subject<boolean>();

    transform($value: Observable<number>, $tong: Observable<number>): Observable<number> {
        // this._subcription($value, $tong);
        // return this._lastedValue;
        return combineLatest([$value, $tong]).pipe(takeUntil(this.$destroy),
            map(([value, tong]) => tong === 0 ? 0 : value / tong),
        );
    }

    private _subcription($value: Observable<number>, $tong: Observable<number>) {
        combineLatest([$value, $tong]).pipe(takeUntil(this.$destroy)).subscribe(([value, tong]) => {
            this._lastedValue = tong === 0 ? 0 : value / tong;
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }


}
