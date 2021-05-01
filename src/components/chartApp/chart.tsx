import * as React from "react";
import { FC } from 'react';
import Player from '../../types/player';
import './chart.scss';
import MultiChart from "./multiChart";
import SingleChart from './singleChart';

export type CssColors = [Color[], number, Color, Color];

const colorCount = 3;

interface Color {
    r: number;
    g: number;
    b: number;
}

interface Props {
    players: Player[];
    splitIndexes: number[] | null;
}

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

const RadarChart: FC<Props> = (props: Props) => {

    const { players, splitIndexes } = props;
    const colors = loadColorsFromCssVars();

    if (players.length === 1 && splitIndexes) {
        return <SingleChart stats={players[0].stats} splitIndexes={splitIndexes} colors={colors} />
    } else {
        return <MultiChart players={players} colors={colors} />
    }
};

export default RadarChart;
