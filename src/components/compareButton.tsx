import * as React from 'react';
import { FC } from 'react';
import { Command } from '../types/message';
import PlayerInfo from '../types/playerInfo';
import Stat from '../types/stat';
import './compareButton.scss';

interface Props {
    info: PlayerInfo;
    stats: Stat[];
}

const Compare: FC<Props> = (props: Props) => {
    const { info, stats } = props;
    function onClick(): void {
        chrome.runtime.sendMessage({
            command: Command.AddToCompare,
            info,
            stats
        });
    }

    return (
        <div className="compare-radar">
            <button title="Compare" onClick={onClick}>
                <span>
                    Compare
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="var(--button-fg)">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
            </button>
        </div>
    );
};

export default Compare;