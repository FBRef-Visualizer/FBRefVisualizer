import * as React from 'react';
import { FC, useContext } from 'react';
import { AppContext } from './appContext';
import { Actions, Tab } from './reducer';

interface Props {
    tab: Tab;
}

const TabToggle: FC<Props> = (props: Props) => {
    const { tab: thisTab } = props;
    const {
        dispatch,
        state: {
            tab: currentTab
        }
    } = useContext(AppContext);
    const isCurrentTab = thisTab === currentTab;

    function onClick(): void {
        dispatch({ type: Actions.ChangeTab, tab: thisTab });
    }

    return (
        <button className={`tab-button tab-button-${thisTab.toLocaleString()}`} disabled={isCurrentTab} onClick={onClick}>
            {thisTab.toLocaleString()}
        </button>
    );
};

export default TabToggle;