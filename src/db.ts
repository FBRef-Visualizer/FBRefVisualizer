import Dexie, { Table } from 'dexie';
import Player from './types/player';

export class FbRefVisualizerDatabase extends Dexie {

    public players: Table<Player, string>;

    constructor() {
        super('fbrefvisualizer-database');
        this
            .version(1)
            .stores({
                players: '&id,info,stats'
            });
        this.players = this.table('players');
    }
}

const fbRefVisualizerDatabase = new FbRefVisualizerDatabase();
export default fbRefVisualizerDatabase;