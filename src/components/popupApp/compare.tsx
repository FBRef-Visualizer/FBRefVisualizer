import * as React from 'react';
import { FC, useContext } from 'react';
import Player from '../../types/player';
import { AppContext } from './appContext';

const PlayerListing: FC<Player> = (props: Player) => {
    const {
        info: {
            name
        }
    } = props;

    return (
        <button>
            {name}
        </button>
    );
};

interface CategoryProps {
    name: string;
    players: Player[];
}

const Category: FC<CategoryProps> = (props: CategoryProps) => {
    const { name, players } = props;
    return (
        <div className="category">
            <h2>{name}</h2>
            <ul>
                {players.map(player => <li key={player.id}><PlayerListing {...player} /></li>)}
            </ul>
        </div>
    );
};

interface CompareGroup {
    [key: string]: Player[];
}

const Compare: FC = () => {
    const {
        state: {
            compare
        }
    } = useContext(AppContext);

    if (!compare || compare.length === 0) {
        return null;
    }

    const groups = compare
        .reduce<CompareGroup>((reducer, player) => {
            const position = player.info.position as string;
            if (!(position in reducer)) {
                reducer[position] = [];
            }
            reducer[position].push(player);
            return reducer;
        }, {});

    console.log('groups', groups);

    return (
        <div className="compare">
            {Object.keys(groups).map(key => <Category key={key} players={groups[key]} name={key} />)}
        </div>
    );


};

export default Compare;