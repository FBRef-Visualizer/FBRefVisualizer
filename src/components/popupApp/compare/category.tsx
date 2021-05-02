import * as React from 'react';
import { FC } from 'react';
import Player from '../../../types/player';
import './compare.scss';
import PlayerListing from './playerListing';

interface Props {
	name: string;
	players: Player[];
}

const Category: FC<Props> = (props: Props) => {
	const { name, players } = props;
	return (
		<div className="category">
			<h2>{name}</h2>
			<ul className="compare-list">
				{players.map(({
					id,
					info,
					timestamp,
					stats
				}) => (
					<PlayerListing
						key={id}
						id={id}
						info={info}
						stats={stats}
						timestamp={timestamp}
					/>
				))}
			</ul>
		</div>
	);
};

export default Category;
