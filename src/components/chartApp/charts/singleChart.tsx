import { ChartDataset } from 'chart.js';
import Stat from '../../../types/stat';
import './chart.scss';
import genericChart, { ColorFunction } from './genericChart';

interface Props {
    stats: Stat[];
    splitIndexes: number[];
}

function sectionLabel(index: number): string {
    switch (index) {
        case 0: return 'Attacking';
        case 1: return 'Possession';
        case 2: return 'Defensive';
        default: return 'Unknown';
    }
}

function transformLabels(props: Props): string[] {
    const { stats } = props;
    return stats.map(s => s.name);
}

function transformValues(props: Props, color: ColorFunction): ChartDataset<'radar', number[]>[] {
    const dataSets: ChartDataset<'radar', number[]>[] = [];

    const { splitIndexes, stats } = props;

    const startingPoints = [0, ...splitIndexes];

    for (let i = 0; i < startingPoints.length; i++) {
        const last = i == startingPoints.length - 1;
        const start = i == 0 ? 0 : startingPoints[i];
        const end = last ? stats.length : startingPoints[i + 1];

        const data: number[] = [];
        for (let statIndex = 0; statIndex < stats.length; statIndex++) {
            if ((statIndex >= start && statIndex <= end) || (statIndex === 0 && last)) {
                data.push(stats[statIndex].percentile);
            } else {
                data.push(0);
            }
        }
        dataSets.push({
            data,
            backgroundColor: color(i),
            label: sectionLabel(i)
        });
    }
    return dataSets;
}

const singleChart = genericChart<Props>(
    transformLabels,
    transformValues,
    'single-chart'
);

export default singleChart;