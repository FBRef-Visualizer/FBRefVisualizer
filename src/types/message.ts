export enum Command {
    Download,
    DownloadResponse,
    Launch,
    DisableIcon,
    EnableIcon
}

export interface Message {
    command: Command;
}

export interface LaunchMessage extends Message {
    command: Command.Launch;
}

export interface DownloadResponseMessage extends Message {
    command: Command.DownloadResponse;
    dataUrl: string;
}

export interface DownloadMessage extends Message {
    command: Command.Download;
}

export interface EnableIconMessage extends Message {
    command: Command.EnableIcon;
}

export interface DisableIconMessage extends Message {
    command: Command.DisableIcon;
}