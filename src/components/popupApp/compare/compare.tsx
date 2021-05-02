import * as React from 'react';
import { FC, useContext, useState } from 'react';
import { sendCommandToTab } from '../../../helpers/chromeHelpers';
import { processPosition } from '../../../helpers/nameHelpers';
import { Command } from '../../../types/message';
import Player from '../../../types/player';
import Icon, { IconType } from '../../generic/icon';
import { AppContext } from '../appContext';
import Category from './category';
import './compare.scss';

interface CompareGroup {
	[key: string]: Player[];
}

function getCompareGroups(compare: Player[]): CompareGroup {
	return compare
		.reduce<CompareGroup>((reducer, player) => {
			const newReducer = { ...reducer };
			const position = processPosition(player.info.position);
			if (!(position in reducer)) {
				newReducer[position] = [];
			}
			newReducer[position].push(player);
			return newReducer;
		}, {});
}

const Compare: FC = () => {
	const [clicked, setClicked] = useState<boolean>(false);

	const {
		state: {
			compare,
			selectedCompare
		}
	} = useContext(AppContext);

	if (!compare || compare.length === 0) {
		return (
			<p className="no-compare">
				To compare players, navigate to a player&apos;s page on
				{' '}
				fbref.com and click
				{' '}
				<em>Add to Compare</em>
				{' '}
				on the Player tab.
			</p>
		);
	}

	const groups = getCompareGroups(compare);

	function compareClicked(): void {
		sendCommandToTab({
			command: Command.Launch,
			players: compare.filter((player) => selectedCompare.indexOf(player.id) >= 0)
		}, () => {
			setClicked(true);
			window.setTimeout(() => window.close(), 500);
		});
	}

	const categoryKeys = Object.keys(groups).sort();

	return (
		<>
			<div className="compare">
				{categoryKeys.map((key) => <Category key={key} players={groups[key]} name={key} />)}
			</div>
			<div className="compare-button">
				<button disabled={selectedCompare.length < 2} onClick={compareClicked} type="button">
					{clicked ? <Icon iconType={IconType.Check} /> : <Icon iconType={IconType.Compare} />}
					<span>
						View Radar
					</span>
				</button>
			</div>
		</>
	);
};

export default Compare;
