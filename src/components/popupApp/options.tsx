import * as React from 'react';
import { FC, useContext, useState } from 'react';
import Icon, { IconType } from '../generic/icon';
import { AppContext } from './appContext';
import './options.scss';
import { Actions } from './reducer';

const Options: FC = () => {
	const [compareClicked, setCompareClicked] = useState<boolean>(false);

	const {
		dispatch,
		state: {
			showRadar,
			hasData,
			canCompare,
			loading,
			currentPlayer
		}
	} = useContext(AppContext);

	function launchChart(): void {
		dispatch({ type: Actions.ToggleRadar, showRadar: true });
		window.setTimeout(() => window.close(), 500);
	}

	function addCompare(): void {
		dispatch({ type: Actions.AddCurrentPlayerToCompare });
		setCompareClicked(true);
	}

	if (loading) {
		return null;
	}

	if (!hasData) {
		return <p>No data available to scrape.</p>;
	}

	return (
		<div className="options">
			{currentPlayer ? <h2>{currentPlayer}</h2> : null}
			<button onClick={launchChart} disabled={showRadar} type="button">
				<Icon iconType={showRadar ? IconType.Check : IconType.View} />
				<span className="label">
					View Radar
				</span>
			</button>
			<button onClick={addCompare} disabled={!canCompare} type="button">
				<Icon iconType={compareClicked ? IconType.Check : IconType.Compare} />
				<span className="label">
					Add Compare
				</span>
			</button>
		</div>
	);
};

export default Options;
