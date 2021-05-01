import { Chart, ChartConfiguration, ChartData, ChartDataset, DefaultDataPoint } from 'chart.js';
import * as React from "react";
import { FC, useCallback } from 'react';
import Player from '../../types/player';
import { CssColors } from './chart';
import './chart.scss';

interface Props {
    players: Player[];
    colors: CssColors;
}

const MultiChart: FC<Props> = (props: Props) => {
    let chart: Chart | null = null;
    const { players, colors: [
        colors, alpha, bg, fg
    ] } = props;

    function color(index: number, a: number | null = null): string {
        a = a ?? alpha;
        if (colors.length > 0) {
            const idx = index % colors.length;
            const { r, g, b } = colors[idx];
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        return `rgba(0, 255, 255, ${a})`;
    }

    function convertToChartData(): ChartData<'radar', number[], string> {
        const data: ChartData<'radar', number[], string> = {
            labels: transformLabels(),
            datasets: transformValues()
        };
        return data;
    }

    function sectionLabel(index: number): string {
        return players[index].info.name;
    }

    function transformLabels(): string[] {
        return players[0].stats.map(s => s.name);
    }

    function transformValues(): ChartDataset<'radar', number[]>[] {
        const dataSets: ChartDataset<'radar', number[]>[] = [];

        for (let i = 0; i < players.length; i++) {
            const { stats } = players[i];

            const data: number[] = [];

            for (let j = 0; j < stats.length; j++) {
                data.push(stats[j].percentile);
            }

            dataSets.push({
                data,
                backgroundColor: color(i, 0.05),
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

    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node) {
            if (chart === null && players.length > 0) {
                const backdropColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
                const color = `rgb(${fg.r}, ${fg.g}, ${fg.b})`;
                const size = 20;

                const config: ChartConfiguration<'radar', DefaultDataPoint<'radar'>, string> = {
                    type: 'radar',
                    data: convertToChartData(),
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color,
                                    font: {
                                        size
                                    }
                                },
                                position: 'right',
                                align: 'start'
                            }
                        },
                        scales: {
                            r: {
                                animate: true,
                                min: 0,
                                max: 100,
                                suggestedMin: 0,
                                suggestedMax: 100,
                                angleLines: {
                                    color
                                },
                                grid: {
                                    color,
                                    circular: true
                                },
                                ticks: {
                                    stepSize: 20,
                                    color,
                                    backdropColor,
                                    font: {
                                        size
                                    }
                                },
                                pointLabels: {
                                    color,
                                    font: {
                                        size
                                    }
                                }
                            }
                        }
                    }
                };
                chart = new Chart(node, config);
            }
        }
    }, [chart, status]);

    return (
        <canvas ref={canvasRef} className="canvas"></canvas>
    );
};

export default MultiChart;
