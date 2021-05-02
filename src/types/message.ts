import Player from './player';

export enum Command {
	Download,
	DownloadDone,
	Launch,
	ScrapeDataForCompare,
	AddToCompare,
	Close,
	RequestLoadStatus,
	RequestCompare,
	RemoveFromCompare,
	InitialLoadComplete
}

interface MessageBase {
	command: Command;
}

export interface LaunchMessage extends MessageBase {
	command: Command.Launch;
	players?: Player[];
}

export interface DownloadDoneMessage extends MessageBase {
	command: Command.DownloadDone;
	dataUrl: string;
}

export interface DownloadMessage extends MessageBase {
	command: Command.Download;
}

export interface AddToCompareMessage extends MessageBase {
	command: Command.AddToCompare;
	player: Player;
}

export interface ScrapeDataForCompareMessage extends MessageBase {
	command: Command.ScrapeDataForCompare;
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

export interface InitialLoadComplete extends MessageBase {
	command: Command.InitialLoadComplete;
	status: boolean;
	name: string | null;
}

export type Message = LaunchMessage |
	DownloadDoneMessage |
	DownloadMessage |
	ScrapeDataForCompareMessage |
	AddToCompareMessage |
	CloseMessage |
	RequestLoadStatusMessage |
	RequestCompareMessage |
	RemoveFromCompare |
	InitialLoadComplete;
