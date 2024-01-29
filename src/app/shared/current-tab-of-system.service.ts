import { Injectable } from '@angular/core';
import { StateService } from './state.service';

interface ICurrentTabOfSystemState {
    currentTabDanhMuc: number;
    currentTabCongCu: number;
}

const initState: ICurrentTabOfSystemState = {
    currentTabCongCu: 0,
    currentTabDanhMuc: 0,
};

@Injectable({
    providedIn: 'root',
})
export class CurrentTabOfSystemService extends StateService<ICurrentTabOfSystemState> {
    $currentTabDanhMuc = this.select(x => x.currentTabDanhMuc);
    $currentTabCongCu = this.select(x => x.currentTabCongCu);


    constructor() {
        super(initState);
    }

    updateCurrentTabDanhMuc(idx: number) {
        this.setState({
            currentTabDanhMuc: idx,
        });
    }

    updateCurrentTabCongCu(idx: number) {
        this.setState({
            currentTabCongCu: idx,
        });
    }
}
