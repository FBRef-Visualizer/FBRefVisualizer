import * as React from 'react';
import { FC, ReactElement, useContext } from 'react';
import { AppContext } from './appContext';
import { Actions, Tab } from './reducer';
import './tabs.scss';

interface TabToggleProps {
    tab: Tab;
}

const TabToggle: FC<TabToggleProps> = (props: TabToggleProps) => {
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

interface Props {
    children: ReactElement | ReactElement[];
}

const Tabs: FC<Props> = (props: Props) => {
    const { children } = props;

    return <div className="tabs">
        <div className="tab-container">
            {children}
        </div>
        <div className="tab-controls">
            {Object.values(Tab).map(tab => <TabToggle tab={tab} />)}
        </div>
    </div>
}

export default Tabs;