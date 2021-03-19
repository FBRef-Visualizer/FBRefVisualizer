import * as ChartJs from 'chart.js';
import * as React from "react";
import { FC, useCallback } from 'react';
import Stat from '../types/stat';
import './chart.scss';

const colorCount = 3;

interface Color {
    r: number;
    g: number;
    b: number;
}

interface Props {
    stats: Stat[];
    splitIndexes: number[];
}

function loadColorsFromCssVars(): [Color[], number, Color, Color] {
    const parseColor = (c: string) => ({
        r: parseInt(c.slice(2, 4), 16),
        g: parseInt(c.slice(4, 6), 16),
        b: parseInt(c.slice(6, 8), 16)
    });

    const colors: Color[] = [];
    const styles = getComputedStyle(document.body);
    for (let i = 1; i <= colorCount; i++) {
        const color = styles.getPropertyValue(`--color${i}`);
        colors.push(parseColor(color));
    }
    const alpha: number = parseFloat(styles.getPropertyValue('--alpha'));
    const bg: Color = parseColor(styles.getPropertyValue('--bg'));
    const fg: Color = parseColor(styles.getPropertyValue('--fg'));

    return [colors, alpha, bg, fg];
}

const Chart: FC<Props> = (props: Props) => {
    let chart: ChartJs | null = null;
    const {
        stats,
        splitIndexes,
    } = props;
    const [colors, alpha, bg, fg] = loadColorsFromCssVars();

    function color(index: number, a: number | null = null): string {
        a = a ?? alpha;
        if (colors.length > 0) {
            const idx = index % colors.length;
            const { r, g, b } = colors[idx];
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        return `rgba(0, 255, 255, ${a})`;
    }

    function convertToChartData(): Chart.ChartData {
        const data: Chart.ChartData = {
            labels: transformLabels(),
            datasets: transformValues()
        };
        return data;
    }

    function sectionLabel(index: number): string {
        switch (index) {
            case 0: return 'Attacking';
            case 1: return 'Possession';
            case 2: return 'Defensive';
            default: return 'Unknown';
        }
    }

    function transformLabels(): string[] {
        return stats.map(s => s.name);
    }

    function transformValues(): Chart.ChartDataSets[] {
        const dataSets: Chart.ChartDataSets[] = [];
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

    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node) {
            if (chart === null && stats.length > 0) {
                const backdropColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
                const fontColor = `rgb(${fg.r}, ${fg.g}, ${fg.b})`;
                const fontSize = 20;
                chart = new ChartJs(node, {
                    type: 'radar',
                    data: convertToChartData(),
                    options: {
                        responsive: true,
                        scale: {
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 100,
                                stepSize: 20,
                                fontColor,
                                backdropColor,
                                fontSize
                            },
                            gridLines: {
                                color: fontColor
                            },
                            pointLabels: {
                                fontColor,
                                fontSize
                            },
                            angleLines: {
                                color: fontColor
                            }
                        },
                        legend: {
                            labels: {
                                fontColor,
                                fontSize
                            },
                            position: 'right',
                            align: 'start'
                        }
                    }
                });
            }
        }
    }, [chart, status, splitIndexes]);

    return (
        <canvas ref={canvasRef} className="canvas"></canvas>
    );
};

export default Chart;
