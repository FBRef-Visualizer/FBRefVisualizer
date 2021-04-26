import * as React from "react";
import { FC, useState } from 'react';
import { Command, Message } from "../types/message";
import PlayerInfo from '../types/playerInfo';
import Stat from '../types/stat';
import './App.scss';
import Attribution from './attribution';
import Chart from './chart';
import CompareButton from './compareButton';
import DownloadButton from "./downloadButton";
import Downloader from "./downloader";
import PlayerInfoHeading from "./playerInfo";

interface Props {
  id: string;
  info: PlayerInfo;
  stats: Stat[];
  splitIndexes: number[];
}

const App: FC<Props> = (props: Props) => {
  const {
    id,
    stats,
    splitIndexes,
    info,
  } = props;
  const { name } = info;
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.command === Command.DownloadResponse) {
      setDataUrl(message.dataUrl);
    }
  });

  return (
    <div className="stats-radar">
      <div className="content">
        <PlayerInfoHeading info={info} />
        <Chart stats={stats} splitIndexes={splitIndexes} />
        <Attribution />
        <DownloadButton />
        <CompareButton id={id} info={info} stats={stats} />
        <Downloader name={name} dataUrl={dataUrl} />
      </div>
    </div>
  );
};

export default App;
