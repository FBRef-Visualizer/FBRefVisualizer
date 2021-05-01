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
            const position = processPosition(player.info.position);
            if (!(position in reducer)) {
                reducer[position] = [];
            }
            reducer[position].push(player);
            return reducer;
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
        return null;
    }

    const groups = getCompareGroups(compare);

    function compareClicked(): void {
        sendCommandToTab({
            command: Command.Launch,
            players: compare.filter(player => selectedCompare.indexOf(player.id) >= 0)
        }, () => setClicked(true));
    }

    const categoryKeys = Object.keys(groups).sort();

    return (
        <>
            <div className="compare">
                {categoryKeys.map(key => <Category key={key} players={groups[key]} name={key} />)}
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