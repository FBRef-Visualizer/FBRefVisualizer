import * as React from 'react';
import { FC, useContext } from 'react';
import formatTime from '../../../helpers/time';
import Player from '../../../types/player';
import Check from '../../generic/check';
import Icon, { IconType } from '../../generic/icon';
import { AppContext } from '../appContext';
import { Actions } from '../reducer';

const PlayerListing: FC<Player> = (props: Player) => {
	const {
		id,
		info: {
			name
		},
		timestamp
	} = props;

	const { state, dispatch, options: { timeFormat } } = useContext(AppContext);
	const { selectedCompare } = state;

	const isSelected = selectedCompare.indexOf(id) >= 0;

	function onChange(): void {
		dispatch({ type: Actions.ToggleSelected, action: isSelected ? 'remove' : 'add', id });
	}

	function onRemove(): void {
		dispatch({ type: Actions.RemovePlayer, id });
	}

	return (
		<li className="player-row">
			<Check checked={isSelected} onChange={onChange} />
			<label htmlFor={id}>
				{name}
			</label>
			<input type="checkbox" checked={isSelected} onChange={onChange} id={id} />
			<button className="remove" onClick={onRemove} type="button">
				<Icon iconType={IconType.Trash} />
			</button>
			<div className="date">
				{formatTime(timestamp, timeFormat)}
			</div>
		</li>
	);
};

export default PlayerListing;
