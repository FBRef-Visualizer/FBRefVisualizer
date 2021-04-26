import Player from './player';

export enum Command {
    Download,
    DownloadResponse,
    Launch,
    DisableIcon,
    EnableIcon,
    AddToCompare,
    Close
}

interface MessageBase {
    command: Command;
}

export interface LaunchMessage extends MessageBase {
    command: Command.Launch;
}

export interface DownloadResponseMessage extends MessageBase {
    command: Command.DownloadResponse;
    dataUrl: string;
}

export interface DownloadMessage extends MessageBase {
    command: Command.Download;
}

export interface EnableIconMessage extends MessageBase {
    command: Command.EnableIcon;
}

export interface DisableIconMessage extends MessageBase {
    command: Command.DisableIcon;
}

export interface AddToCompareMessage extends MessageBase {
    command: Command.AddToCompare;
    player: Player;
}

export interface CloseMessage extends MessageBase {
    command: Command.Close;
}

export type Message = LaunchMessage |
    DownloadResponseMessage |
    DownloadMessage |
    EnableIconMessage |
    DisableIconMessage |
    AddToCompareMessage |
    CloseMessage;