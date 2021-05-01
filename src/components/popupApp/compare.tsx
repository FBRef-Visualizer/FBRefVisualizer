import * as React from 'react';
import { FC, useContext, useState } from 'react';
import { sendCommandToTab } from '../../helpers/chromeHelpers';
import { processPosition } from '../../helpers/nameHelpers';
import { formatTime } from '../../helpers/time';
import { Command } from '../../types/message';
import Player from '../../types/player';
import Icon, { IconType } from '../generic/icon';
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


    const iconType = checked ? IconType.CheckBox : IconType.CheckBoxEmpty;
    const className = checked ? "checked" : "unchecked";

    return (
        <Icon
            iconType={iconType}
            className={`checkbox ${className}`}
            onClick={onChange}
        />
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
                <Icon iconType={IconType.Trash} />
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
    const [clicked, setClicked] = useState<boolean>(false);

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
        }, () => setClicked(true));
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