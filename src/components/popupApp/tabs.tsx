import * as React from 'react';
import { FC, ReactElement, useContext } from 'react';
import { AppContext } from './appContext';
import { Tab } from './reducer';
import './tabs.scss';
import TabToggle from './tabToggle';

interface Props {
  children: ReactElement | ReactElement[];
}

const Tabs: FC<Props> = (props: Props) => {
  const { children } = props;
  const { state: { isOnFbRef } } = useContext(AppContext);

  if (!isOnFbRef) {
    return null;
  }

  return (
	<div className="tabs">
		<div className="tab-container">
			{children}
		</div>
		<div className="tab-controls">
			{Object.values(Tab).map((tab) => <TabToggle tab={tab} key={tab} />)}
		</div>
	</div>
  );
};

export default Tabs;
