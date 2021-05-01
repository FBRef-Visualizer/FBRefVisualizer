import { ChartDataset } from 'chart.js';
import Player from '../../../types/player';
import './chart.scss';
import genericChart, { ColorFunction } from './genericChart';
interface Props {
    players: Player[];
}

function transformLabels(props: Props): string[] {
    return props.players[0].stats.map(s => s.name);
}

function transformValues(props: Props, color: ColorFunction): ChartDataset<'radar', number[]>[] {

    const dataSets: ChartDataset<'radar', number[]>[] = [];
    const { players } = props;

    function sectionLabel(index: number): string {
        return players[index].info.name;
    }

    for (let i = 0; i < players.length; i++) {
        const { stats } = players[i];

        const data: number[] = [];

        for (let j = 0; j < stats.length; j++) {
            data.push(stats[j].percentile);
        }

        dataSets.push({
            data,
            backgroundColor: color(i, 0.15),
            borderColor: color(i, 0.9),
            borderWidth: 3,
            label: sectionLabel(i),
            pointBorderColor: color(i, 1),
            pointBackgroundColor: color(i, 1),
            pointRadius: 4
        });
    }
    console.log('dataSets', dataSets);
    return dataSets;
}

const multiChart = genericChart<Props>(
    transformLabels,
    transformValues
);

export default multiChart;