import * as React from 'react';
import { FC, useContext } from 'react';
import { processPosition } from '../../helpers/nameHelpers';
import { sendCommandToTab } from '../../helpers/sendCommandToTab';
import { formatTime } from '../../helpers/time';
import { Command } from '../../types/message';
import Player from '../../types/player';
import { AppContext } from './appContext';
import './compare.scss';
import { Actions } from './reducer';

interface CheckProps {
    checked: boolean;
    onChange: () => void;
}

const Check: FC<CheckProps> = (props: CheckProps) => {
    const {
        checked,
        onChange
    } = props;

    if (checked) {
        return (
            <svg className="checkbox checked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={onChange}>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                <path className="alt" d="M16.6 7.6L10 14.2l-2.6-2.6L6 13l4 4 8-8z" />
            </svg>
        );
    }

    return (
        <svg className="checkbox unchecked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={onChange}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
    );

};

const PlayerListing: FC<Player> = (props: Player) => {
    const {
        id,
        info: {
            name
        },
        timestamp
    } = props;

    const { state, dispatch } = useContext(AppContext);
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
            <button className="remove" onClick={onRemove}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                </svg>
            </button>
            <div className="date">
                {formatTime(timestamp)}
            </div>
        </li>
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
            <ul className="compare-list">
                {players.map(player => <PlayerListing key={player.id} {...player} />)}
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
            compare,
            selectedCompare
        }
    } = useContext(AppContext);

    if (!compare || compare.length === 0) {
        return null;
    }

    const groups = compare
        .reduce<CompareGroup>((reducer, player) => {
            const position = processPosition(player.info.position);
            if (!(position in reducer)) {
                reducer[position] = [];
            }
            reducer[position].push(player);
            return reducer;
        }, {});

    function compareClicked(): void {
        sendCommandToTab({
            command: Command.Launch,
            players: compare.filter(player => selectedCompare.indexOf(player.id) >= 0)
        });
    }

    return (
        <>
            <div className="compare">
                {
                    Object
                        .keys(groups)
                        .sort()
                        .map(key => <Category key={key} players={groups[key]} name={key} />)
                }
            </div>
            <div className="compare-button">
                <button disabled={selectedCompare.length < 2} onClick={compareClicked}>
                    View Radar
                </button>
            </div>
        </>
    );


};

export default Compare;