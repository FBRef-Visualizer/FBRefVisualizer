import PlayerInfo from "./playerInfo";
import Stat from './stat';

interface Player {
    id: string;
    info: PlayerInfo;
    stats: Stat[];
}

export default Player;