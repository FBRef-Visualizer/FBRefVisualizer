import {
	Chart, ChartConfiguration, ChartData, ChartDataset, DefaultDataPoint
} from 'chart.js';
import * as React from 'react';
import {
	FC, useCallback, useMemo, useRef
} from 'react';
import './chart.scss';

const colorCount = 3;

interface Color {
	r: number;
	g: number;
	b: number;
}

export type CssColors = [Color[], number, Color, Color];
export type ColorFunction = (index: number, alpha?: number | null) => string;

function loadColorsFromCssVars(): CssColors {
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

export default function genericChart<TProps>(
	transformLabels: (props: TProps) => string[],
	transformValues: (props: TProps, color: ColorFunction) => ChartDataset<'radar', number[]>[],
	canvasId: string
): FC<TProps> {
	return (props: TProps) => {
		const chart = useRef<Chart<'radar'> | null>(null);
		const cssColors = useMemo(() => loadColorsFromCssVars(), []);
		const [colors, alpha, bg, fg] = cssColors;

		const makeColor = useCallback((index: number, a: number | null = null) => {
			const alphaToUse = a ?? alpha;
			if (colors.length > 0) {
				const idx = index % colors.length;
				const { r, g, b } = colors[idx];
				return `rgba(${r}, ${g}, ${b}, ${alphaToUse})`;
			}
			return `rgba(0, 255, 255, ${alphaToUse})`;
		}, [alpha, colors]);

		const canvasRef = useCallback((node: HTMLCanvasElement) => {
			const backdropColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
			const color = `rgb(${fg.r}, ${fg.g}, ${fg.b})`;
			const size = 20;

			function convertToChartData(): ChartData<'radar', number[], string> {
				const data: ChartData<'radar', number[], string> = {
					labels: transformLabels(props),
					datasets: transformValues(props, makeColor)
				};
				return data;
			}

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

			if (chart.current) {
				chart.current.options = { ...config.options };
				chart.current.data = config.data;
				chart.current.update();
			} else {
				chart.current = new Chart<'radar'>(node, config);
			}
		}, [bg.r, bg.g, bg.b, fg.r, fg.g, fg.b, makeColor, props, chart]);

		return (
			// eslint-disable-next-line react/jsx-indent
			<canvas ref={canvasRef} className="canvas" id={canvasId} key={canvasId} />
		);
	};
}
