import * as React from 'react';
import { FC } from 'react';
import { processPosition } from '../../helpers/nameHelpers';
import PlayerInfo from '../../types/playerInfo';
import PlayerPosition from '../../types/playerPosition';
import './playerInfo.scss';

interface Props {
    name: string;
    position: PlayerPosition;
}

const PlayerInfo: FC<Props> = (props: Props) => {
    const { name, position } = props;
    return (
        <div className="player-info">
            <h1 className="player-name">
                {name}
            </h1>
            <h2 className="player-position">
                {processPosition(position)}
            </h2>
        </div>
    );
}
export default PlayerInfo;