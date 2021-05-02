import * as React from 'react';
import { FC, ReactElement, useContext } from 'react';
import { AppContext } from './appContext';
import { Tab as Tabs } from './reducer';

interface Props {
  tab: Tabs;
  children: ReactElement | ReactElement[];
}

const Tab: FC<Props> = (props: Props) => {
  const {
    tab: thisTab,
    children
  } = props;
  const {
    state: {
      tab: currentTab
    }
  } = useContext(AppContext);
  const isCurrentTab = thisTab === currentTab;

  if (isCurrentTab) {
    return (
	<div className={`tab tab-${thisTab.toLocaleLowerCase()}`}>
		{children}
	</div>
    );
  }
  return null;
};

export default Tab;
