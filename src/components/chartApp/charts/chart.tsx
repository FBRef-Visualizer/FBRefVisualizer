import * as React from 'react';
import { FC } from 'react';
import Player from '../../../types/player';
import './chart.scss';
import MultiChart from './multiChart';
import SingleChart from './singleChart';

interface Props {
  players: Player[];
  splitIndexes: number[] | null;
}

const RadarChart: FC<Props> = (props: Props) => {
  const { players, splitIndexes } = props;

  if (players.length === 1 && splitIndexes) {
    return <SingleChart stats={players[0].stats} splitIndexes={splitIndexes} />;
  }
  return <MultiChart players={players} />;
};

export default RadarChart;
