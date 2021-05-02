import Dexie, { Table } from 'dexie';
import Player from './types/player';

export class FbRefVisualizerDatabase extends Dexie {
	public players: Table<Player, string>;

	constructor() {
		super('fbrefvisualizer-database');
		this
			.version(3)
			.stores({
				players: '&id,info,stats,timestamp'
			});
		this.players = this.table('players');
	}
}

const fbRefVisualizerDatabase = new FbRefVisualizerDatabase();
export default fbRefVisualizerDatabase;
