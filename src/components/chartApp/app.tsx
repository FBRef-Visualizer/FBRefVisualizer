import * as React from "react";
import { FC, useState } from "react";
import { Command, Message } from "../../types/message";
import Player from "../../types/player";
import "./app.scss";
import Attribution from "./attribution";
import Buttons from "./buttons/buttons";
import Chart from "./chart";
import Downloader from "./downloader";
import PlayerInfoHeading from "./playerInfo";

interface Props {
  players: Player[];
  splitIndexes: number[] | null;
}

function getName(players: Player[]): string {
  if (players.length < 2) {
    return players[0].info.name;
  }
  return players.map(p => p.info.name).join(' vs. ');
}

const App: FC<Props> = (props: Props) => {
  const {
    players,
    splitIndexes
  } = props;
  const name = getName(players);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.command === Command.DownloadDone) {
      setDataUrl(message.dataUrl);
    }
  });

  return (
    <div className="stats-radar">
      <div className="content">
        <PlayerInfoHeading name={name} position={players[0].info.position} />
        <Chart players={players} splitIndexes={splitIndexes} />
        <Buttons />
        <Attribution />
        <Downloader name={name} dataUrl={dataUrl} />
      </div>
    </div>
  );
};

export default App;
