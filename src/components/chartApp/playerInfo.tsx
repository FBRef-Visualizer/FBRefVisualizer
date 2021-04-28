import * as React from 'react';
import { FC } from 'react';
import PlayerInfo from '../../types/playerInfo';
import PlayerPosition from '../../types/playerPosition';
import './playerInfo.scss';

interface Props {
    info: PlayerInfo;
}

function processName(name: string): string {
    switch (name) {
        case 'Dele Alli':
            return 'Dele';
        default: return name;
    }
}

function processPosition(position: PlayerPosition): string {
    switch (position) {
        case 'attacking mid':
            return 'Attacking Midfielder/Winger';
        case 'center back':
            return 'Center Back';
        case 'forward':
            return 'Forward';
        case 'fullback':
            return 'Fullback';
        case 'midfield':
            return 'Midfielder';
        default: return 'Unknown';
    }
}

const PlayerInfo: FC<Props> = (props: Props) => {
    const {
        info: {
            name,
            position
        }
    } = props;
    return (
        <div className="player-info">
            <h1 className="player-name">
                {processName(name)}
            </h1>
            <h2 className="player-position">
                {processPosition(position)}
            </h2>
        </div>
    );
}
export default PlayerInfo;