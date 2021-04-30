import Player from './player';




export enum Command {
    Download,
    DownloadDone,
    Launch,
    SetInitialState,
    AddToCompare,
    Close,
    RequestLoadStatus,
    RequestCompare,
    RemoveFromCompare
}

interface MessageBase {
    command: Command;
}

export interface LaunchMessage extends MessageBase {
    command: Command.Launch;
}

export interface DownloadDoneMessage extends MessageBase {
    command: Command.DownloadDone;
    dataUrl: string;
}

export interface DownloadMessage extends MessageBase {
    command: Command.Download;
}

export interface SetInitialStateMessage extends MessageBase {
    command: Command.SetInitialState;
    status: boolean;
}

export interface AddToCompareMessage extends MessageBase {
    command: Command.AddToCompare;
    player: Player;
}

export interface CloseMessage extends MessageBase {
    command: Command.Close;
}

export interface RequestLoadStatusMessage extends MessageBase {
    command: Command.RequestLoadStatus;
}

export interface RequestCompareMessage extends MessageBase {
    command: Command.RequestCompare;
}

export interface RemoveFromCompare extends MessageBase {
    command: Command.RemoveFromCompare;
    id: string;
}

export type Message = LaunchMessage |
    DownloadDoneMessage |
    DownloadMessage |
    SetInitialStateMessage |
    AddToCompareMessage |
    CloseMessage |
    RequestLoadStatusMessage |
    RequestCompareMessage |
    RemoveFromCompare;