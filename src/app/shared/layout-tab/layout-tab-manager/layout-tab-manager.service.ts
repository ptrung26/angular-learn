import { Injectable } from '@angular/core';
import { TabDataType } from './TabDataType';
import { Observable } from 'rxjs';
import { StateService } from '@app/shared/state.service';
import * as _ from 'lodash';


interface ILayoutTabManagerState {
    listTab: TabDataType[];
    currentTabIndex: number;
}

const initialState: ILayoutTabManagerState = {
    currentTabIndex: 0,
    listTab: [],
};

@Injectable()
export class LayoutTabManagerService extends StateService<ILayoutTabManagerState> {
    $listTab: Observable<TabDataType[]> = this.select(x => x.listTab);
    $currentTabIndex: Observable<number> = this.select(x => x.currentTabIndex);

    constructor() {
        super(initialState);
    }

    addTab(input: TabDataType) {
        const lstTab = _.cloneDeep(this.state.listTab);
        const ide = lstTab.findIndex(x => x.key === input.key);
        // if (ide > -1) {
        //     lstTab[ide].title = input.title;
        // }
        if (ide === -1 || input.showMultiTab) {
            lstTab.push(input);
            this.setState({
                currentTabIndex: lstTab.length,
                listTab: lstTab,
            });
        } else {
            const curTab = lstTab[ide];
            curTab.title = input.title;
            if (input.dataRef !== curTab.dataRef) {
                curTab.dataRef = _.cloneDeep(input.dataRef);
            }
            if (input.dataObsRef !== curTab.dataObsRef) {
                curTab.dataObsRef = _.cloneDeep(input.dataObsRef);
            }
            this.setState({
                currentTabIndex: ide,
                listTab: lstTab,
            });
        }
    }

    closeCurrentTab() {
        this.closeTab(this.state.currentTabIndex);
    }


    closeTab(index: number) {
        const tabs = this.state.listTab;
        tabs.splice(index, 1);
        this.setState({
            // currentTabIndex: lstTab.length,
            listTab: tabs,
        });
    }

    closeOtherTab(index: number) {
        const tabs = this.state.listTab;

        // tabs.splice(index, 1);
        this.setState({
            // currentTabIndex: lstTab.length,
            listTab: index === 0 ? [tabs[0]] : [tabs[0], tabs[index]],
        });
    }

    closeAllTab() {
        const tabs = this.state.listTab;
        this.setState({
            listTab: [tabs[0]],
        });
    }

    closeTabRight(index: number) {
        this.setState({
            listTab: this.state.listTab.filter((x, i) => i <= index),
        });
    }

    changeTab($event: number) {
        this.setState({
            currentTabIndex: $event,
        });
    }
}
