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
                {players.map(player => <PlayerListing key={player.id} {...player} />)}
            </ul>
        </div>
    );
};

export default Category;