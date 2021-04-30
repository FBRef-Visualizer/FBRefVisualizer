import * as React from 'react';
import { FC } from 'react';
import { processName, processPosition } from '../../helpers/nameHelpers';
import PlayerInfo from '../../types/playerInfo';
import './playerInfo.scss';

interface Props {
    info: PlayerInfo;
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